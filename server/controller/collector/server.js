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

'use strict';
var logger = require('winston');
var net = require('net');
var ProtocolConnectionController = require(__base + 'controller/collector/protocolconnection');
var collectorPool = require(__base + 'controller/collector/collectorpool');
var sequelize = require(__base + 'controller/database/platformsequelize');
var PlatformError = require(__base + 'utils/platformerror');

var Collector = sequelize.model('Collector');

var Server = function(){
	var server = net.createServer();
	server.on('connection', function(socket) {
		//base info about the collector
    var collector = {};
		socket.isConnected = true;
		var protocol = new ProtocolConnectionController(socket, function(collectorInfo){
			//Set local variables to use as logger info when the connections is closed.
			collector = collectorInfo;
		});

		var address = {};
		address.address = socket.remoteAddress;
		address.port = socket.remotePort;
  	logger.debug("New connection from " + address.address);

  	var lostCollector = function(){
			logger.info('Client with MAC ' + collector.mac + ' and ID ' + collector.id + ' Disconnected');
			socket.isConnected = false;
			protocol = null;
			collectorPool.updateStatusByMac(collector, Collector.statusEnum.OFFLINE);
  	}

		socket.on('end', lostCollector);
		socket.on('close', lostCollector);

		socket.on('data', function(data) {
			logger.silly('Server : data received.' + JSON.stringify(data));
			protocol.processData(data);
		});

		socket.on("error", function(err) {
		 	socket.destroy();
    	logger.error(err.stack);
  	});

		socket.setTimeout(13000, function(){
			logger.warn("Socket Timeout");
			socket.end();
			socket.destroy();
		});
	});

	this.startServer = function(){
		server.listen(8124, function() {
		  logger.info('RT Server bound on port 8124');
		});
	}
}

module.exports = Server;
