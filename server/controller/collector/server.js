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
		// var collector = new Collector();
    var collector = {};
		socket.isConnected = true;

		var protocol = new ProtocolConnectionController(socket, function(collectorInfo){
			//Set local variables to use as logger info when the connections is closed.
			collector.mac = collectorInfo.macaddress;
			collector.id = collectorInfo.id;
		});

		var address = {};
		address.address = socket.remoteAddress;
		address.port = socket.remotePort;

  	logger.info("New connection from " + address.address);

  	var lostCollector = function(){
		logger.info('Client with MAC ' + collector.mac + ' and ID ' + collector.id + ' Disconnected');

		socket.isConnected = false;
		protocol = null;

		collectorPool.updateStatusByMac(collector, collector.statusEnum.OFFLINE);
  	}

		socket.on('end', lostCollector);
		socket.on('close', lostCollector);

		socket.on('data', function(data) {
			logger.debug('Server : data received.');
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
		server.listen(8124, function() { //'listening' listener
		  logger.info('RT Server bound on port 8124');
		});
	}
}

module.exports = Server;
