var Server = function(){

	var net = require('net');
	var server = net.createServer();

	var events = require('events');
	var serverEmitter = new events.EventEmitter();

	var ProtocolConnectionController = require('./controllers/protocol-connection');
	var SocketController = require('./controllers/serversocket');

	var socketController = new SocketController();
	socketController.socketTimeout();


	server.on('connection', function(socket) {

		var protocol = new ProtocolConnectionController(socket);
		var address = socket.address();

    	console.log("RFIDPLATFORM[DEBUG]: New connection from " + address.address + ":" + address.port);    	 	

		socket.on('end', function() {
			console.log('RFIDPLATFORM[DEBUG]: Client Disconnected');
			console.log('RFIDPLATFORM[DEBUG]: Collector MAC from Socket: ' + socket.CollectorMAC);

			//TODO update collector status to offline.
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