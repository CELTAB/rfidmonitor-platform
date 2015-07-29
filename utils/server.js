var Collector =  require('../models/collector');
var ProtocolConnectionController = require('../controllers/protocol-connection');
var logger = require('winston');
var PlatformError = require('./platformerror');
var collectorPool = require('../controllers/collectorpool');

var Server = function(){

	var net = require('net');
	var server = net.createServer();

	server.on('connection', function(socket) {

		//base info about the collector

		var collector = new Collector();

		socket.isConnected = true;

		var protocol = new ProtocolConnectionController(socket, function(collectorInfo){

			//Set local variables to use as logger info when the connections is closed.
			collector.mac = collectorInfo.macaddress;
			collector.id = collectorInfo.id;
		});

		var address = socket.address();

    	logger.info("New connection from " + address.address + ":" + address.port);    	 	

		socket.on('end', function() {
			logger.info('Client with MAC ' + collector.mac + ' and ID ' + collector.id + ' Disconnected');

			socket.isConnected = false;
			delete protocol;

			collectorPool.updateStatusByMac(collector, collector.statusEnum.OFFLINE);
			
		});
	
		socket.on('data', function(data) {
			logger.debug('Server : data received.');
			protocol.processData(data);
		});
	});

	this.startServer = function(){
		server.listen(8124, function() { //'listening' listener
		  logger.info('RT Server bound on port 8124');
		});	
	}
}

module.exports = Server;