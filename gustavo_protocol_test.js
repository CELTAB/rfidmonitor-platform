
var ProtocolController = require('./controllers/protocol');
protocol = new ProtocolController();

var buildMessage = function(message){
		var size = message.length;
		var newMessage = String('00000000' + size).slice(size.toString().length);
		var newMessage = newMessage.concat(message);
		return newMessage;
}

var message = buildMessage('{"1-11-111"::"2-22-222"}');
var cut = message.length/2;

//send first half
protocol.processData(new Buffer(message.slice(0, cut)));
//send second half
protocol.processData(new Buffer(message.slice(cut, message.length)));

//send 2 packets at same time
message = buildMessage('{"333-33-3":"4-44-444"}') + buildMessage('{"555":"666"}');
protocol.processData(new Buffer(message));

//send 2 and half packets at same time

var message2 = buildMessage('{"777_777":"888"}');
cut = message2.length/2;

protocol.processData(new Buffer(message + message2.slice(0, cut)));
//send second half
protocol.processData(new Buffer(message2.slice(cut, message2.length)));