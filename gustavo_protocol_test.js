
var ProtocolController = require('./controllers/protocol');
protocol = new ProtocolController();

// simulate limit number of bytes to send each TCP commit.
var maxBytesSend = 47;
// simulate number of packets (size + jsonobj) to send.
var numberOfPackages = 547;
// size of fake_data field of the json obj.
var maxFakeDataSize = 100;
// number of broken json pkts to send.
var numberOfBrokenPkts = 48;

console.log("Parameters: \nmaxBytesSend: "+ maxBytesSend);
console.log("numberOfPackages: "+ numberOfPackages);
console.log("maxFakeDataSize: "+maxFakeDataSize);
console.log("numberOfBrokenPkts: "+numberOfBrokenPkts +"\n\n");

function buildMessage(message){
		var size = message.length;
		var newMessage = String('00000000' + size).slice(size.toString().length);
		var newMessage = newMessage.concat(message);
		return newMessage;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function send(message){

	var cur = 0;
	while(message.length > 0){
		cur = (message.length > maxBytesSend) ? maxBytesSend : message.length;
		var messageToSend = message.slice(0,cur);
		message = message.slice(cur, message.length);
		protocol.processData(new Buffer(messageToSend));
	}	
		
}

var broken_count = 0;
for (i=0;i<numberOfPackages;i++){
	var obj = {}
	obj.package_id = i;
	var size = randomInt(1,maxFakeDataSize);
	obj.fake_data_size = size;
	var fake_data = new Buffer(size);
	fake_data.fill('#');
	obj.fake_data = fake_data.toString();
	if(broken_count < numberOfBrokenPkts){
		send(buildMessage("BROKEN"+JSON.stringify(obj)+"BROKEN"));
		broken_count++;
	}
	else
		send(buildMessage(JSON.stringify(obj)));
}

console.log("number of sent pkts: " + numberOfPackages);