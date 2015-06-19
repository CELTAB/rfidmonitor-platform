var Server = function(){

	var CollectorDao = require('./models/collectordao');
	var Collector =  require('./models/collector');
	var net = require('net');
	var server = net.createServer();

	var events = require('events');
	var serverEmitter = new events.EventEmitter();

	var ProtocolConnectionController = require('./controllers/protocol-connection');
	var SocketController = require('./controllers/serversocket');

	var socketController = new SocketController();
	socketController.socketTimeout();


	server.on('connection', function(socket) {

		//base infod about the collector
		var collectorMac = '';
		var collectorId = 0;

		var protocol = new ProtocolConnectionController(socket, function(collectorInfo){
			collectorMac = collectorInfo.macaddress;
			collectorId = collectorInfo.id;
		});

		var address = socket.address();

    	console.log("RFIDPLATFORM[DEBUG]: New connection from " + address.address + ":" + address.port);    	 	

		socket.on('end', function() {
			console.log('RFIDPLATFORM[DEBUG]: Client with MAC ' + collectorMac + ' and ID ' + collectorId + ' Disconnected');
			var collectordao = new CollectorDao();
			
			collectordao.updateStatus(collectorId, new Collector().statusEnum.Offline, function(err, result){
				if(err){
					console.log("Error on handle_ACK: " + err);
					return;
				}

				if(result >= 1){
					console.log("Status atualizado para Offline");
				}
			});
		});
	
		socket.on('data', function(data) {
			console.log('RFIDPLATFORM[DEBUG]: Server : data received.');
			protocol.processData(data);
		});
	});

	this.startServer = function(){
		server.listen(8124, function() { //'listening' listener
		  console.log('RFIDPLATFORM[DEBUG]: RT Server bound on port 8124');
		});	
	}
}

module.exports = Server;