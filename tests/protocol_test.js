
var ProtocolConnectionController = require('../controllers/protocol-connection');
protocol = new ProtocolConnectionController();

// simulate limit number of bytes to send each TCP commit.
var maxBytesSend = 500;
// simulate number of packets (size + jsonobj) to send.
var numberOfPackages = 500;
// size of fake_data field of the json obj.
var maxFakeDataSize = 500;
// number of broken json pkts to send.
var numberOfBrokenPkts = 20;

function buildMessage(message){
		var size = message.length;
		var newMessage = String('00000000' + size).slice(size.toString().length);
		var newMessage = newMessage.concat(message);
		return newMessage;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

var sendBuffer = new Buffer(0);

function send(message, forceSend){
	var numberBytesSend = randomInt(1,maxBytesSend);	
	console.log("PROTOCOL_TEST[DEBUG] : numberBytesSend: "+numberBytesSend);
	
	if (message)
		sendBuffer = Buffer.concat([sendBuffer, new Buffer(message)]);

	var cur = 0;

	while(sendBuffer.length >= numberBytesSend || forceSend===true){
		cur = numberBytesSend;
		if (forceSend===true)
			cur = sendBuffer.length;
		var messageToSend = sendBuffer.slice(0,cur);
		sendBuffer = sendBuffer.slice(cur, sendBuffer.length);
		protocol.processData(new Buffer(messageToSend));

		if(sendBuffer.length == 0)
			forceSend = false;
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
		send(buildMessage("BROKEN"+JSON.stringify(obj)+"BROKEN"),false);
		broken_count++;
	}
	else
		send(buildMessage(JSON.stringify(obj)),false);
}

if (sendBuffer.length > 0)
	send(null,true);

console.log("PROTOCOL_TEST[DEBUG] : ---- PARAMETERS ----");
console.log("PROTOCOL_TEST[DEBUG] : numberOfPackages: "+ numberOfPackages);
console.log("PROTOCOL_TEST[DEBUG] : maxFakeDataSize: "+maxFakeDataSize);
console.log("PROTOCOL_TEST[DEBUG] : numberOfBrokenPkts: "+numberOfBrokenPkts);
console.log("PROTOCOL_TEST[DEBUG] : number of sent pkts: " + numberOfPackages);

console.log('\n\n\n################################################');
if(	numberOfPackages == protocol.getTmpVars()['received']
	&& numberOfBrokenPkts == protocol.getTmpVars()['broken']
	&& (numberOfPackages - numberOfBrokenPkts) == protocol.getTmpVars()['success'])
	console.log('################# TEST SUCCESS #################');
else
	console.log('################# FAILLLLLLLLL #################');
console.log('################################################');