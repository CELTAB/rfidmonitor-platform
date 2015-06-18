var RFIDDataDao = require('../models/rfiddatadao');

var ProtocolMessagesController = function(socket){

	var rfiddatadao = new RFIDDataDao();
	var packCounter = 0;

	this.processMessage = function(message){

		//todo should we check message structure?

		switch(message.type){
			case "SYN":
				handle_SYN();
				break;
			case "ACK":
				handle_ACK();
				break;
			case "ACK-ALIVE":
				handle_ACKALIVE(message);
				break;
			case "DATA":
				handle_DATA(message);
				break;
			default:
				console.log("RFIDPLATFORM[WARNING]: Unknown message type ["+message.type+"]. Ignoring entire message.");
		}
	}

	var handle_SYN = function(){
		console.log("RFIDPLATFORM[DEBUG]: handle_SYN");

		sendObject(buildMessageObject("ACK-SYN", {}));

		/*TODO set collector status to online.
			- If it exists, just update status;
			- Else add the new collector.
		*/

	}

	var handle_ACK = function(){
		console.log("RFIDPLATFORM[DEBUG]: handle_ACK");
	}

	var handle_ACKALIVE = function(message){
		console.log("RFIDPLATFORM[DEBUG]: handle_ACKALIVE");
		try{
			//TODO reset alive status.
			var clientInfo = message.data;
			//socketController.setAlive(clientInfo.macaddress);
		}catch(e){
			console.log("RFIDPLATFORM[DEBUG]: handle_ACKALIVE : Invalid MAC Address");
		}
	}

	var handle_DATA = function(message){
		// console.log("RFIDPLATFORM[DEBUG]: handle_DATA raw message: " + JSON.stringify(message,null,"\t"));

		rfiddatadao.insert(message.data, function(err,_md5diggest){
			if (err)
				console.log("PROTOCOL MESSAGES err : " + err);
			else{
				//send back to collecting point an ACK-DATA message.
				console.log("todo. send back to collecting point an ACK-DATA message."+_md5diggest);	
				// console.log("Response message: " + JSON.stringify(buildMessageObject("ACK-DATA", {md5diggest: [_md5diggest]})));
				packCounter++;
				sendObject(buildMessageObject("ACK-DATA", {md5diggest: [_md5diggest]}));			
				console.log("Sent " + packCounter + " RESPONSES. UNITL NOW");
			}
		});

		/*TODO insert the data on database.
			- If success on insert: send back to collecting point an ACK-DATA message.

						var collectorMac = message.data.macaddress;
						var md5hash = message.data.datasummary.md5diggest;
						console.log("Hash inserted: " + md5hash);

						var ack_data = {
										type: 'ACK-DATA',
										data: {
											md5diggest: [md5hash]
										},
										datetime: (new Date).toISOString()
									   };
						console.log("Sending ACK-DATA: " + JSON.stringify(ack_data));
						try{
							socket.write(buildMessage(JSON.stringify(ack_data)));
						}catch(e){
							
						}
		*/

	}

	var buildMessage = function(message){
		var size = message.length;
		var newMessage = String('00000000' + size).slice(size.toString().length);
		var newMessage = newMessage.concat(message);
		return newMessage;
	}

	var buildMessageObject = function(m_type, m_data){
		return {type: m_type, data: m_data, datetime: (new Date()).toISOString()};
	}

	var sendObject = function(object){
		if(!socket){
			console.log("RFIDPLATFORM[ERROR]: sendMessage without socket.")
			return;
		}

		try{
			var message = JSON.stringify(object);
			console.log("RFIDPLATFORM[DEBUG]: sendMessage : " + message);
			socket.write(buildMessage(message));

		}catch(e){
			console.log("RFIDPLATFORM[DEBUG]: sendObject error: " + e);
		}
		
	}

	this.buildMessageSYNALIVE = function(){
		var syn_alive = JSON.stringify({ type:"SYN-ALIVE", data: {}, datetime: (new Date()).toISOString() });
		return buildMessage(syn_alive);
	}

};

module.exports = ProtocolMessagesController;

/*
RFIDPLATFORM[DEBUG]: handle_DATA raw message: {
	"data": {
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
			"idbegin": -1273252204,
			"idend": -1273254596,
			"md5diggest": "f9b0941547b464689121e9e80266fde2"
		},
		"id": 100,
		"macaddress": "B8:27:EB:BB:0C:70",
		"name": "Celtab-Serial"
	},
	"datetime": "2015-06-17T14:49:17",
	"type": "DATA"
}
*/