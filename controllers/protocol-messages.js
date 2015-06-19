var RFIDDataDao = require('../models/rfiddatadao');
var CollectorDao = require('../models/collectordao');
var Collector =  require('../models/collector');
var logger = require('../logs').Logger;

var ProtocolMessagesController = function(socket, setOnlineCollector){

	var rfiddatadao = new RFIDDataDao();
	var collectordao =  new CollectorDao();
	var packCounter = 0;

	this.processMessage = function(message){

		//todo should we check message structure?

		switch(message.type){
			case "SYN":
				handle_SYN(message);
				break;
			case "ACK":
				handle_ACK(message);
				break;
			case "ACK-ALIVE":
				handle_ACKALIVE(message);
				break;
			case "DATA":
				handle_DATA(message);
				break;
			default:
				logger.warn("Unknown message type ["+message.type+"]. Ignoring entire message.");
		}
	}

	var handle_SYN = function(message){

		var data = message.data;
		logger.debug("handle_SYN\n Message: " + JSON.stringify(message));

		collectordao.findByMac(data.macaddress, function(err, collector){
		if(err){
			logger.error("Error: " + err);
			return;
		}

		if(collector != null){
			
			logger.debug("collector found. ID: " + collector.id);
			collector.status = collector.statusEnum.Online;

			var ackObj = {id:collector.id, macaddress:collector.mac, name:collector.name};
			sendObject(buildMessageObject("ACK-SYN", {id:collector.id, macaddress:collector.mac, name:collector.name}));
		}else{

			var newCollector = new Collector();
			newCollector.group_id = 1; //default

			if(data.name == ""){
				//if the collector doesn't have a name, set to 'Unknown'.
				newCollector.name = "Unknown";
			}
			else{
				//Use the name from the collector.
				newCollector.name = data.name;
			}

			newCollector.mac = data.macaddress;
			newCollector.status = new Collector().statusEnum.Online;

			logger.debug("Collector not found. INSERTING: " + JSON.stringify(newCollector));

			collectordao.insert(newCollector, function(err, collectorId){

				if(err){
					logger.error("Error: " + err);
					return;
				}

				logger.debug("Collector inserted. new ID: " + collectorId);
				sendObject(buildMessageObject("ACK-SYN", {id:collectorId, macaddress:newCollector.mac, name:newCollector.name}));
			});
		}
	});
	}

	// Complete handshake, update the collector status to Online
	var handle_ACK = function(message){
		var data = message.data;
		collectordao.updateStatus(data.id, new Collector().statusEnum.Online, function(err, result){
			if(err){
				logger.error("Error on handle_ACK: " + err);
				return;
			}

			if(result >= 1){
				//return the mac address for the Server class.
				setOnlineCollector({id:data.id, macaddress:data.macaddress});
				logger.debug("Status atualizado para Online");
			}
		});
	}

	var handle_ACKALIVE = function(message){
		logger.debug("handle_ACKALIVE");
		try{
			//TODO reset alive status.
			var clientInfo = message.data;
			//socketController.setAlive(clientInfo.macaddress);
		}catch(e){
			logger.error("handle_ACKALIVE : Invalid MAC Address");
		}
	}

	var handle_DATA = function(message){
		logger.debug("handle_DATA raw message: " + JSON.stringify(message,null,"\t"));

		rfiddatadao.insert(message.data, function(err,_md5diggest){
			if (err)
				logger.error("PROTOCOL MESSAGES err : " + err);
			else{
				//send back to collecting point an ACK-DATA message.
				packCounter++;
				sendObject(buildMessageObject("ACK-DATA", {md5diggest: [_md5diggest]}));			
				logger.debug("Sent " + packCounter + " RESPONSES. UNITL NOW");
			}
		});
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
			logger.error("sendMessage without socket.")
			return;
		}

		try{
			var message = JSON.stringify(object);
			logger.debug("sendMessage : " + message);
			socket.write(buildMessage(message));

		}catch(e){
			logger.error("sendObject error: " + e);
		}
		
	}

	this.buildMessageSYNALIVE = function(){
		var syn_alive = JSON.stringify({ type:"SYN-ALIVE", data: {}, datetime: (new Date()).toISOString() });
		return buildMessage(syn_alive);
	}

};

module.exports = ProtocolMessagesController;

/*
handle_DATA raw message: {
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