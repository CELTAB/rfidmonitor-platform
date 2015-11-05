/*
In the node.js intro tutorial (http://nodejs.org/), they show a basic tcp
server, but for some reason omit a client connecting to it.  I added an
example at the bottom.
Save the following server in example.js:
*/

// var net = require('net');

// var server = net.createServer(function(socket) {
// 	socket.write('Echo server\r\n');
// 	socket.pipe(socket);
// });
//
// server.listen(1337, '127.0.0.1');

/*
And connect with a tcp client from the command line using netcat, the *nix
utility for reading and writing across tcp/udp network connections.  I've only
used it for debugging myself.
$ netcat 127.0.0.1 1337
You should see:
> Echo server
*/

/* Or use this example tcp client written in node.js.  (Originated with
example code from
http://www.hacksparrow.com/tcp-socket-programming-in-node-js.html.) */

var randomchars = require('../server/utils/randomchars');
var net = require('net');
var collector = {id: 1, macaddress: "78:2b:cb:c0:75:8e", name: "Collector-Simulator"};

var client = new net.Socket();
client.connect(8124, '127.0.0.1', function() {
	console.log('Connected');
	sendObject(buildMessageObject("SYN", collector));
});

client.on('data', function(data) {
	processMessage(data);
	// sendObject(buildMessageObject("ACK", collector));
	// client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
	client.destroy();
});

var processMessage = function(message){
	console.log('Received: ' + message);

	var permanentDataBuffer = message;
	var packetSize = parseInt(permanentDataBuffer.slice(0, 8));
	permanentDataBuffer = permanentDataBuffer.slice(8, permanentDataBuffer.length);
	if(isNaN(packetSize)){
			logger.error("Sem Banana no buffer...");
			return;
	}

	var data = permanentDataBuffer.slice(0, packetSize).toString();
	var message = {};
	message = JSON.parse(data);

	switch(message.type){
		case "ACK-SYN":
			sendAckMessage(message);
			break;
		case "SYN-ALIVE":
			sendAckAliveMessage(message);
			break;
		case "ACK-DATA":
			ackdataHandler(message);
			break;
		default:
			logger.warn("Unknown message type ["+message.type+"]. Ignoring entire message.");
	}
}


//-------------------
var packagesSent = {};
var sentCouter = 0;
var receivedCouter = 0;
var intervalTime = 7000;
var xTimes = 3;
//-------------------

var sendAckMessage = function(message){
	collector = message.data;
	console.log(collector);
	sendObject(buildMessageObject("ACK", collector));
}

var sendAckAliveMessage = function(message){
	console.log(message);
	sendObject(buildMessageObject("ACK-ALIVE", {}));
}

var ackdataHandler = function(message){
	console.log(message);
	receivedCouter++;

	if(!packagesSent[message.data.md5diggest[0]])
		console.log("Received diggest: " + message.data.md5diggest[0] + ". But is invalid!");

	console.log("Response received for " + receivedCouter + " Packages");
	console.log("Missing " + (sentCouter - receivedCouter) + " Responses");
}

var randomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var buildMessage = function(message){
	var size = message.length;
	var newMessage = String('00000000' + size).slice(size.toString().length);
	var newMessage = newMessage.concat(message);
	return newMessage;
}

var getTimezonedISODateString = function(){
	var date = new Date();
	//Subtracts the timezone hours to local time.
	date.setHours(date.getHours() - (date.getTimezoneOffset() / 60) );
	return date.toISOString();
}

var buildMessageObject = function(m_type, m_data){
	return {type: m_type, data: m_data, datetime: getTimezonedISODateString()};
}

var sendObject = function(object){
	if(!client){
		console.log("sendMessage without socket.")
		return;
	}

	try{
		var message = JSON.stringify(object);
		console.log("sendMessage : " + message);

		// if(client.isConnected){
			console.log('sending data');
			client.write(buildMessage(message));
		// }

	}catch(e){
		console.log("sendObject error: " + e);
	}
}

var sendRfidDatas = function(){
	var qdtPk = xTimes;
	var data = collector;
	data.datasummary = {};
	var dt = [];
	while(qdtPk > 0){
		var rfidobj = {};
		rfidobj.identificationcode = randomInt(1000000, 9999999);
		rfidobj.datetime = new Date();
		dt.push(rfidobj);
		qdtPk--;
	}
	data.datasummary.data = dt;
	data.datasummary.md5diggest = randomchars.uid(32);
	console.log(data);
	packagesSent[data.datasummary.md5diggest] = data;
	sentCouter++;

	sendObject(buildMessageObject("DATA", data));
	// sendObject(buildMessageObject("DATA", data));
}

// sendRfidDatas();
/*
{
  "datasummary": {
    "data": [
      {
        "applicationcode": 0,
        "datetime": "2014-10-15T15:58:33",
        "id": 1282,
        "idantena": 1,
        "idcollectorpoint": 100,
        "identificationcode": 44332211
      }
    ],
    "md5diggest": "f9b0941547b464689121e9e80266fde2"
  },
  "id": 100,
  "macaddress": "B8:27:EB:BB:0C:70",
  "name": "Celtab-Serial"
}
*/
