var CollectorDao = require('../dao/collectordao');
var Collector =  require('../models/collector');
var ProtocolConnectionController = require('../controllers/protocol-connection');
var logger = require('winston');
var PlatformError = require('./platformerror');

var Server = function(){

	var net = require('net');
	var server = net.createServer();

	server.on('connection', function(socket) {

		//base infod about the collector
		var collectorMac = '';
		var collectorId = 0;

		socket.isConnected = true;

		var protocol = new ProtocolConnectionController(socket, function(collectorInfo){

			//Set local variables to use as logger info when the connections is closed.
			collectorMac = collectorInfo.macaddress;
			collectorId = collectorInfo.id;
		});

		var address = socket.address();

    	logger.info("RFIDPLATFORM[DEBUG]: New connection from " + address.address + ":" + address.port);    	 	

		socket.on('end', function() {
			logger.info('RFIDPLATFORM[DEBUG]: Client with MAC ' + collectorMac + ' and ID ' + collectorId + ' Disconnected');

			socket.isConnected = false;
			delete protocol;

			var collectordao = new CollectorDao();
			
				//And the collector status must be change for Offline.
				collectordao.updateStatus(collectorId, new Collector().statusEnum.Offline, function(err, rowCount){
					if(err){
						logger.error("Error on database: Collector Updatestatus: " + err);
						return;
					}
					
					if(rowCount != 1){
						logger.error('Error on update collector status.');
						return;
					}

					logger.debug("Updated Status to Offline");
				});
		});
	
		socket.on('data', function(data) {
			logger.debug('RFIDPLATFORM[DEBUG]: Server : data received.');
			protocol.processData(data);
		});
	});

	this.startServer = function(){
		server.listen(8124, function() { //'listening' listener
		  logger.info('RFIDPLATFORM[DEBUG]: RT Server bound on port 8124');
		});	
	}
}

module.exports = Server;