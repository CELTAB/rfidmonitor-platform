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

	this.getAll = function(){
		return pool;
	}

	this.getCollectorByMac = function(mac){
		return pool[mac];
	}

	this.getStatusByMac = function(mac){
    if(pool[mac]){
      return pool[mac].status || Collector.statusEnum.OFFLINE;
    }
    logger.debug("Collector pool getStatusByMac" + mac + " not found.");
		return Collector.statusEnum.OFFLINE;
  }

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

  this.push = function(collector){
  	if(this.isCollectorValid(collector)){
			pool[collector.mac] = collector;
			logger.debug("CollectorPool : pushed");
			return true;
		}
		logger.error("CollectorPool : push : invalid collector");
		return false;
	}

	this.removeByMac = function(mac){
		if(pool[mac]){
			delete pool[mac];
			logger.debug("Collector " + mac + " removed.");
			return true;
		}
		logger.debug("Collector " + mac + " not found.");
		return false;
	}

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

CollectorPool.instance = null;
CollectorPool.getInstance = function(){
  if(this.instance === null){
      this.instance = new CollectorPool();
  }
  return this.instance;
}

module.exports = CollectorPool.getInstance();
