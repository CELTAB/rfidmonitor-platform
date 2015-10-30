'use strict';
var logger = require('winston');
var CollectorMonitor = require(__base + 'controller/collector/collectormonitor');
var collectorPool = require(__base + 'controller/collector/collectorpool');
var PlatformError = require(__base + 'utils/platformerror');

//LoadModules
var RFIDData = require(__base + 'models/rfiddata');
var Collector =  require(__base + 'models/collector');
// var CollectorDao = require('../dao/collectordao');
// var RFIDDataDao = require('../dao/rfiddatadao');

var ProtocolMessagesController = function(socket, setOnlineCollector){

	var rfiddatadao = new RFIDDataDao();
	var collectordao =  new CollectorDao();
	var packCounter = 0;
	var responses = 0;

	var collectormonitor = new CollectorMonitor();
	this.processMessage = function(message){
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
		logger.silly("handle_SYN\n Message: " + JSON.stringify(message));

    // Collector.scope({method: ['byMac', data.macaddress]}).findOne()
    Collector.findOne({where: {mac: data.macaddress}})
    .then(function(collector){
      if(collector){
        logger.debug("Collector found. ID: " + collector.id);
        collectorPool.updateStatusByMac(collector, Collector.statusEnum.ONLINE);
        var ackObj = {id:collector.id, macaddress:collector.mac, name:collector.name};
        sendObject(buildMessageObject("ACK-SYN", ackObj));
      }else{
        //Insert new collector
        var newCollector = {};
        newCollector.name = (!!data.name)? data.name : "Unknown";
				newCollector.mac = data.macaddress;

				logger.debug("Collector not found. INSERTING: " + JSON.stringify(newCollector));
        Collector.create(newCollector)
        .then(function(collector){
          newCollector.id = collector.id;
					logger.debug("Collector inserted. new ID: " + newCollector.id);

					collectorPool.updateStatusByMac(newCollector, Collector.statusEnum.OFFLINE);
					sendObject(buildMessageObject("ACK-SYN", {id:newCollector.id, macaddress:newCollector.mac, name:newCollector.name}));
        })
        .catch(function(e){
					logger.error("Error: " + e);
        });
    }
  })
  .catch(function(e){
    logger.error("Error: " + e);
  });
};

	// Complete handshake, update the collector status to Online
	var handle_ACK = function(message){
		var data = message.data;
		var collector = {
  		id: data.id,
  		mac: data.macaddress,
  		name: data.name
    };
		if(collectorPool.updateStatusByMac(collector, Collector.statusEnum.ONLINE)){
			//return the mac address for the Server class.
			logger.debug("Update Status to Online");
			var collectorInfo = {id: data.id, macaddress: data.macaddress};
			setOnlineCollector(collectorInfo);
			/*Start the function that will monitoring the status of the collector.
  			@Param1: Informations about the collector, as id and macAddress
  			@Param2: A function to send the SYN-ALIVE message to this collector
  			@Param3: A function to close the connection with this socket if is not responding.
			*/
			collectormonitor.startMonitor(collectorInfo, sendSynAliveMessage, socketInactive);
		}else{
			logger.error("Collector not found. Cannot update status to ONLINE");
		}
	}

	var handle_ACKALIVE = function(message){
		logger.debug("handle_ACKALIVE");
		//Update the collector monitor to status alive.
		collectormonitor.setAlive();
	}

	var handle_DATA = function(message){
		logger.silly("handle_DATA raw message: " + JSON.stringify(message,null,"\t"));
		packCounter++;
		logger.debug("Packages Received: " + packCounter);

    var RfidCtrl = require(__base + 'controller/models/rfiddata');
    RfidCtrl.save(message.data, function(err, md5diggest){
      if(err)
        logger.error("PROTOCOL MESSAGES err : " + err);

      responses++;
  		sendObject(buildMessageObject("ACK-DATA", {md5diggest: [md5diggest]}));
  		logger.debug("Sent " + responses + " RESPONSES. UNITL NOW");
    });

    //TODO: parei aqui

		// rfiddatadao.insert(message.data, function(err,_md5diggest){
		// 	if (err)
		// 		logger.error("PROTOCOL MESSAGES err : " + err);
		// 	else{
		// 		//send back to collecting point an ACK-DATA message.
		// 		responses++;
		// 		sendObject(buildMessageObject("ACK-DATA", {md5diggest: [_md5diggest]}));
		// 		logger.debug("Sent " + responses + " RESPONSES. UNITL NOW");
		// 	}
		// });
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
		if(!socket){
			logger.error("sendMessage without socket.")
			return;
		}

		try{
			var message = JSON.stringify(object);
			logger.silly("sendMessage : " + message);

			if(socket.isConnected)
				socket.write(buildMessage(message));
			else
				logger.debug("Socket is already closed");
		}catch(e){
			logger.error("sendObject error: " + e);
		}
	}

	//Function passed to collector monitor
	var sendSynAliveMessage = function(){
		var syn_alive = { type:"SYN-ALIVE", data: {}, datetime: getTimezonedISODateString() };
		sendObject(syn_alive);
	}

	//Function passed to collector monito. Used to close a connection when the collector don't listen to the SYN-ALIVE message
	var socketInactive = function(){
		logger.debug("Socket inactive.");

		if(socket.isConnected){
			logger.debug("Close the connection");
			socket.end();
			// socket.close();
			socket.destroy();
		}
	}
};

module.exports = ProtocolMessagesController;

/*

OLD FORMAT
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

NEW FORMAT:

handle_DATA raw message: {
	"data": {
		"datasummary": {
			"data": [
				{
					"datetime": "2014-10-15T15:58:33",
					"rfidcode": 44332211,
					"extra_data":{
									"idantena": 1
								}
				}
			],
			"md5diggest": "f9b0941547b464689121e9e80266fde2"
		},
		"macaddress": "B8:27:EB:BB:0C:70",
		"name": "Celtab-Serial"
	},
	"datetime": "2015-06-17T14:49:17",
	"type": "DATA"
}
*/
