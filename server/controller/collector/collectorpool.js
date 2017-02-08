/****************************************************************************
**
** Copyright (C) 2015
**                     Gustavo Valiati <gustavovaliati@gmail.com>
**                     Thiago R. M. Bitencourt <thiago.mbitencourt@gmail.com>
**
** This file is part of the FishMonitoring project
**
** This program is free software; you can redistribute it and/or
** modify it under the terms of the GNU General Public License
** as published by the Free Software Foundation; version 2
** of the License.
**
** This program is distributed in the hope that it will be useful,
** but WITHOUT ANY WARRANTY; without even the implied warranty of
** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
** GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License
** along with this program; if not, write to the Free Software
** Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
**
****************************************************************************/

var logger = require('winston');
var PlatformError = require(__base + 'utils/platformerror');
var Collector = require(__base + 'models/collector');
// var db = require('../utils/database');
// var CollectorDao = require('../dao/collectordao');

/**
* Class that holds a pool of collectors present in the system.
* The collector's status can be get and set, and is kept in memory.
* @class
*/
var CollectorPool = function CollectorPool(){
	var pool = {};
	Collector.findAll().then(function(collectors){
		var totalCollectors = 0;
		collectors.forEach(function(collector){
			var c = collector.get({plain: true});
			logger.silly("Load Collecor: " + c.name);
			pool[c.mac] = c;
			totalCollectors++;
		});
		logger.debug("CollectorPool : pool populated from database with " + totalCollectors + ' collectors');
	}).catch(function(e){
		return new PlatformError("CollectorPool : Cannot get all collectors from database. Error: " + e);
	});

	/**
	* Get every collector present in the pool;
	* @return {Object} Is a object map, where the key is the collector's mac.
	*/
	this.getAll = function(){
		return pool;
	}

	/**
	* Get a collector from the pool, by its mac.
	* @param  {String} mac is the collector's mac address.
	* @return {Object}     is the collector from the pool.
	*/
	this.getCollectorByMac = function(mac){
		return pool[mac];
	}

	/**
	* Get the collector's status from the pool.
	* @param  {String} mac is the collector's mac address.
	* @return {Collector.statusEnum}     Collector.statusEnum.OFFLINE or Collector.statusEnum.ONLINE
	*/
	this.getStatusByMac = function(mac){
		if(pool[mac]){
			return pool[mac].status || Collector.statusEnum.OFFLINE;
		}
		logger.debug("Collector pool getStatusByMac" + mac + " not found.");
		return Collector.statusEnum.OFFLINE;
	}

	/**
	* Update a collector in the pool, by the given mac reference and status wanted.
	* @param  {Object} collector is the collector.
	* @param  {Collector.statusEnum} status    is the new status: Collector.statusEnum.OFFLINE or Collector.statusEnum.ONLINE
	* @return {boolean}           True for a successful update, or false otherwise.
	*/
	this.updateStatusByMac = function(collector, status){
		if(this.isCollectorValid(collector)){
			logger.debug("Setting status of " + collector.name + " to: " + status);
			if(pool[collector.mac]){
				pool[collector.mac].status = status;
				return true;
			}else{
				return false;
			}
		}else{
			logger.error("CollectorPool : updateStatusByMac : invalid collector");
			return false;
		}
	}

	/**
	* Insert a new collector into the pool. Uses its mac as key reference. This does not remove from database, only from the memory.
	* @param  {Object} collector is the collector.
	* @return {boolean}           True for a successful insert, or false otherwise.
	*/
	this.push = function(collector){
		if(this.isCollectorValid(collector)){
			pool[collector.mac] = collector;
			logger.debug("CollectorPool : pushed");
			return true;
		}
		logger.error("CollectorPool : push : invalid collector");
		return false;
	}

	/**
	* Remove a collector from the pool, by its mac. This does not remove from database, only from the memory.
	* @param  {String} mac is the collector's mac.
	* @return {boolean}           True for a successful remove, or false otherwise.
	*/
	this.removeByMac = function(mac){
		if(pool[mac]){
			delete pool[mac];
			logger.debug("Collector " + mac + " removed.");
			return true;
		}
		logger.debug("Collector " + mac + " not found.");
		return false;
	}

	/**
	* Validates the collector's mac string.
	* @param  {Object}  collector the collector.
	* @return {boolean}           True for a valid mac, or false otherwise.
	*/
	this.isCollectorValid = function(collector){
		var regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
		if(collector.mac && regex.test(collector.mac)){
			return true;
		}
		return false;
	}

	if(CollectorPool.caller != CollectorPool.getInstance){
		throw new PlatformError("This object cannot be instanciated");
	}
}

/**
* Holds the only instance for the CollectorPool class. Singleton implementation.
* @type {Object}
*/
CollectorPool.instance = null;

/**
* Gets the only instance for the CollectorPool class.
* @return {Object} is the CollectorPool
*/
CollectorPool.getInstance = function(){
	if(this.instance === null){
		this.instance = new CollectorPool();
	}
	return this.instance;
}

module.exports = CollectorPool.getInstance();
