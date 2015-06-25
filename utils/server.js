var CollectorDao = require('../dao/collectordao');
var Collector =  require('../models/collector');
var ProtocolConnectionController = require('../controllers/protocol-connection');
var logger = require('winston');

var Server = function(){

	var net = require('net');
	var server = net.createServer();

	server.on('connection', function(socket) {

		//base infod about the collector
		var collectorMac = '';
		var collectorId = 0;

		var protocol = new ProtocolConnectionController(socket, function(collectorInfo){

			//Set local variables to use as logger info when the connections is closed.
			collectorMac = collectorInfo.macaddress;
			collectorId = collectorInfo.id;
		});

		var address = socket.address();

    	logger.info("RFIDPLATFORM[DEBUG]: New connection from " + address.address + ":" + address.port);    	 	

		socket.on('end', function() {
			logger.info('RFIDPLATFORM[DEBUG]: Client with MAC ' + collectorMac + ' and ID ' + collectorId + ' Disconnected');
			var collectordao = new CollectorDao();
			
			//And the collector status must be change for Offline.
			collectordao.updateStatus(collectorId, new Collector().statusEnum.Offline, function(err, result){
				if(err){
					logger.error("Error on close socket connection: " + err);
					return;
				}

				if(result >= 1){
					logger.debug("Update Status to Offline");
				}
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