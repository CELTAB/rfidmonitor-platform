/****************************************************************************
**
** Copyright (C) 2015
**                     Gustavo Valiati <gustavovaliati@gmail.com>
**                     Thiago R. M. Bitencourt <thiago.mbitencourt@gmail.com>
**
** This file is part of the FishMonitoring project
**
** This program is free software; you can redistribute it and/or
** modify it under the terms of the GNU General Public License
** as published by the Free Software Foundation; version 2
** of the License.
**
** This program is distributed in the hope that it will be useful,
** but WITHOUT ANY WARRANTY; without even the implied warranty of
** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
** GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License
** along with this program; if not, write to the Free Software
** Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
**
****************************************************************************/

'use strict';
var logger = require('winston');
var CollectorMonitor = require(__base + 'controller/collector/collectormonitor');
var collectorPool = require(__base + 'controller/collector/collectorpool');
var PlatformError = require(__base + 'utils/platformerror');

//LoadModules
var RFIDData = require(__base + 'models/rfiddata');
var Collector =  require(__base + 'models/collector');
var Group =  require(__base + 'models/group');
var RfidCtrl = require(__base + 'controller/models/rfiddata');
var CollectorCtrl =  require(__base + 'controller/models/collector');

/**
* Class that handles an message acquired by the protocol in the socket connection with the collector.
* @param {Object} socket             is the tcp socket communication with the collector.
* @param {function} setOnlineCollector Function that should be called when the collector completes
* @class
*/
var ProtocolMessagesController = function(socket, setOnlineCollector){
	var packCounter = 0;
	var responses = 0;

	var collectormonitor = new CollectorMonitor();

	/**
	* Handles a given message by its type.
	* The messages are defined in the protocol. Check the project's wiki for the protocol details.
	* @param  {Object} message is the message object.
	* @return {void}
	*/
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

	/**
	* Handles a SYN protocol defined message.
	* @param  {Object} message is the message object.
	* @return {void}
	*/
	var handle_SYN = function(message){
		var data = message.data;
		logger.silly("handle_SYN\n Message: " + JSON.stringify(message));
		try{

			CollectorCtrl.findOrCreate(data, function(collector){
				if(collector.then){
					collector.then(function(c){
						logger.info("Connecting to Collector with ID: " + c.id + " and MAC: " + c.mac);
						setOnlineCollector(c);
						sendObject(buildMessageObject("ACK-SYN", {id:c.id, macaddress:c.mac, name:c.name}));
					},
					function(e){
						logger.error('Error: ' + err);
						return callback(err);
					});
				}else{
					var c = collector;
					logger.info("Connecting to Collector with ID: " + c.id + " and MAC: " + c.mac);
					setOnlineCollector(c);
					sendObject(buildMessageObject("ACK-SYN", {id:c.id, macaddress:c.mac, name:c.name}));
				}
			});
		}catch(e){
			logger.error("Error: " + e);
		}
	};

	/**
	* Handles a ACK protocol defined message.	 *
	* Completes the handshake and update the collector status to Online
	*
	* @param  {Object} message is the message object.
	* @return {void}
	*/
	var handle_ACK = function(message){
		var data = message.data;
		var collector = {
			id: data.id,
			mac: data.macaddress,
			name: data.name
		};

		if (collector.mac) {
			logger.info("Update collector datetime: " + data.success);

			if(collectorPool.updateStatusByMac(collector, Collector.statusEnum.ONLINE)){
				//return the mac address for the Server class.
				var collectorInfo = {id: data.id, mac: data.macaddress, name: data.name};
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
	}

	/**
	* Handles a ACK-ALIVE protocol defined message.
	*
	* @param  {Object} message is the message object.
	* @return {void}
	*/
	var handle_ACKALIVE = function(message){
		logger.silly("handle_ACKALIVE");
		//Update the collector monitor to status alive.
		collectormonitor.setAlive();

		var dateNow = new Date();
		var collectorDate = new Date(message.datetime);
		collectorDate.setHours(collectorDate.getHours() + (collectorDate.getTimezoneOffset() / 60));
		/* Update collector time if different from the server */
		if ((dateNow.getFullYear() !== collectorDate.getFullYear())
		|| (dateNow.getMonth() !== collectorDate.getMonth())
		|| (dateNow.getDay() !== collectorDate.getDay())
		|| (dateNow.getHours() !== collectorDate.getHours())
		|| (dateNow.getMinutes() !== collectorDate.getMinutes())) {
			logger.warn("Sending DATETIME message");
			sendObject(buildMessageObject("DATETIME", {}));
		}
	}

	/**
	* Handles a DATA protocol defined message. Here occurs the rfiddata insertion.
	*
	* @param  {Object} message is the message object.
	* @return {void}
	*/
	var handle_DATA = function(message){
		logger.silly("handle_DATA raw message: " + JSON.stringify(message,null,"\t"));
		packCounter++;
		logger.debug("Packages Received: " + packCounter);

		RfidCtrl.save(message.data, function(err, result){

			logger.warn("===============================");
			logger.warn(result);

			if(err){
				logger.error("PROTOCOL MESSAGES err : " + err);
				return;
			}

			responses++;
			sendObject(buildMessageObject("ACK-DATA", {md5diggest: [result.hash]}));
			logger.silly("Sent " + responses + " RESPONSES. FOR: " + message.data.macaddress);
		});
	}

	/**
	* Prepares the message header to be sent. Concats the message size in front of the message.
	* @param  {String} message Is the message object converted to string.
	* @return {String}         Is the new message, containing the header.
	*/
	var buildMessage = function(message){
		var size = message.length;
		var newMessage = String('00000000' + size).slice(size.toString().length);
		var newMessage = newMessage.concat(message);
		return newMessage;
	}

	/**
	* Gets the local datetime by the local timezone.
	* @return {String} Date in string format.
	*/
	var getTimezonedISODateString = function(){
		var date = new Date();
		//Subtracts the timezone hours to local time.
		date.setHours(date.getHours() - (date.getTimezoneOffset() / 60) );
		return date.toISOString();
	}

	/**
	* Build the message object structure before serialization
	* @param  {String} m_type is the message type.
	* @param  {Object} m_data is the message data object.
	* @return {Object}        The structured message object.
	*/
	var buildMessageObject = function(m_type, m_data){
		return {type: m_type, data: m_data, datetime: getTimezonedISODateString()};
	}
	/**
	* Sends a given object to the collector. Uses the socket present in the class.
	* @param  {Object} object is the final structured object.
	* @return {void}
	*/
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

	/**
	* This function is passed to the collector monitor, to give him the ability to respond to keep alive messages.
	* @see CollectorMonitor#startMonitor
	* @return {void}
	*/
	var sendSynAliveMessage = function(){
		var syn_alive = { type:"SYN-ALIVE", data: {}, datetime: getTimezonedISODateString() };
		sendObject(syn_alive);
	}

	/**
	* This function is passed to the collector monitor,
	* to close a connection when the collector does not receive a SYN-ALIVE message
	* @see CollectorMonitor#startMonitor
	* @return {void}
	*/
	var socketInactive = function(){
		logger.debug("Socket inactive. Closing Connection");
		if(socket.isConnected){
			socket.end();
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
