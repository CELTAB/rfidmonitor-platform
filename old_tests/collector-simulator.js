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

var net = require('net');

var PACKAGES_QUANTITY = 50; // total number of packages must be sent.
var RFIDDATA_QUANTITY = 10; // max number of RFIDData (that is random) per package;
var CONNECTION_QUANTITY = 2; // number of connections/collectors;
var SEND_INTERVAL_MIN = 500;
var SEND_INTERVAL_MAX = 5000; // interval in miliseconds each socket send must be done;
var PACKAGES_PER_SEND = 1; // number of packages per SEND_INTERVAL;

var reportMap = {
	totalPackagesSent : 0,
	totalRfidSent : 0,
	totalPackagesReceived : 0,
	totalRfidReceived : 0,
	totalPackagesMissing: 0,
	totalRfidMissing : 0,
	totalResponsesReceived: 0,
	errors : [],
	collectorsConnected : 0,
	delay : {},
	missingHistoryBySecond : [],
	insertedPackagesBySecond : [],
	insertedRfidBySecond : []
};

var finalReport = function(){
	clearInterval(screenReportInterval);
	clearInterval(historyInterval);

	var missingSoma = reportMap.missingHistoryBySecond.reduce(function(total, next){
		return total+next;
	}, 0);

	var insertedPackageSoma = reportMap.insertedPackagesBySecond.reduce(function(total, next){
		return total+next;
	}, 0);

	var insertedRfidSoma = reportMap.insertedRfidBySecond.reduce(function(total, next){
		return total+next;
	}, 0);

	console.log("================== FINAL REPORT ==================");
	console.log("ARGS: " + args);
	console.log("Collectors connected: " + reportMap.collectorsConnected);
	console.log("~Seconds: " + reportMap.missingHistoryBySecond.length);
	console.log("Average missing packages per second: " + (missingSoma / reportMap.missingHistoryBySecond.length));
	console.log("Average inserted packages per second: " + (insertedPackageSoma / reportMap.insertedPackagesBySecond.length));
	console.log("Average inserted rfid per second: " + (insertedRfidSoma / reportMap.insertedRfidBySecond.length));

	reportMap.totalPackagesMissing = reportMap.totalPackagesSent - reportMap.totalPackagesReceived;
	console.log("Total packages sent/received/missing: " + reportMap.totalPackagesSent + "/" + reportMap.totalPackagesReceived + "/" + reportMap.totalPackagesMissing);

	reportMap.totalRfidMissing = reportMap.totalRfidSent - reportMap.totalRfidReceived;
	console.log("Total rfid sent/received/missing: " + reportMap.totalRfidSent + "/" + reportMap.totalRfidReceived + "/" + reportMap.totalRfidMissing);
	process.exit(0);
}

var historyLastInsertedPackageValue = 0;
var historyLastInsertedRfidValue = 0;
var historyInterval = setInterval(function(){
	reportMap.totalPackagesMissing = reportMap.totalPackagesSent - reportMap.totalPackagesReceived;
	reportMap.totalRfidMissing = reportMap.totalRfidSent - reportMap.totalRfidReceived;

	reportMap.missingHistoryBySecond.push(reportMap.totalPackagesMissing);

	reportMap.insertedPackagesBySecond.push(reportMap.totalPackagesReceived - historyLastInsertedPackageValue);
	historyLastInsertedPackageValue = reportMap.totalPackagesReceived;

	reportMap.insertedRfidBySecond.push(reportMap.totalRfidReceived - historyLastInsertedRfidValue);
	historyLastInsertedRfidValue = reportMap.totalRfidReceived;

	if(PACKAGES_QUANTITY * CONNECTION_QUANTITY === reportMap.totalPackagesReceived){
		screenReport();
		finalReport();
	}

}, 1000);

var screenReport = function(){
	console.log("ARGS: " + args);
	console.log("Collectors connected: " + reportMap.collectorsConnected);

	reportMap.totalPackagesMissing = reportMap.totalPackagesSent - reportMap.totalPackagesReceived;
	console.log("Total packages sent/received/missing: " + reportMap.totalPackagesSent + "/" + reportMap.totalPackagesReceived + "/" + reportMap.totalPackagesMissing);

	reportMap.totalRfidMissing = reportMap.totalRfidSent - reportMap.totalRfidReceived;
	console.log("Total rfid sent/received/missing: " + reportMap.totalRfidSent + "/" + reportMap.totalRfidReceived + "/" + reportMap.totalRfidMissing);

	console.log("For a delay of A packages there are B collectors. [A -> B]");
	for (var i in reportMap.delay){
		if(reportMap.delay[i])
			console.log(i + " -> " + reportMap.delay[i]);
	}

	console.log("---------------------------------------------------------3s update----")

	if(reportMap.errors.length > 0){
		console.log("We are stopping. Errors: " + reportMap.errors.length);
		console.log(reportMap.errors);
		clearInterval(screenReportInterval);
		clearInterval(historyInterval);
		process.exit(1);
	}
};

var screenReportInterval = setInterval(screenReport.bind(this),3000);

function CollectorConnection(collectorId){
	this.collector = null;
	this.protocol = null;
	this.client = new net.Socket();
	this.packagesSent = {};
	this.sentCouter = 0;
	this.receivedCouter = 0;
	this.xLoops = PACKAGES_QUANTITY;
	this.maxRFID = RFIDDATA_QUANTITY;
	this.totalResponses = 0;
	this.sendInterval = SEND_INTERVAL_MIN;
	this.totalSentRfiddata = 0;
	this.totalSentPackage = 0;
	this.collectorId = collectorId;
	this.delayCategory = -1;



	// this.printInterval = setInterval(function(){
	// 	var missing = this.sentCouter - this.receivedCouter;
	// 	if(missing > 0){
	// 		console.log("--COLLECTOR [" + this.collectorId + "] --packages: "+PACKAGES_QUANTITY+" --rfiddata: "+RFIDDATA_QUANTITY+" --connections: "+CONNECTION_QUANTITY+" --packagePerSend: "+PACKAGES_PER_SEND+" --sendIntervalMin:"+SEND_INTERVAL_MIN+" --sendIntervalMax:"+SEND_INTERVAL_MAX);
	// 		console.log("Total responses: " + this.totalResponses);
	// 		console.log("Diggest responses received for " + this.receivedCouter + " Packages");
	// 		console.log("Missing " + missing + " Diggest Responses");
	// 		console.log("totalSentRfiddata:" + this.totalSentRfiddata);
	// 		console.log("totalSentPackage" + this.totalSentPackage + "\n");
	// 	}else{
	// 		process.stdout.write(".RT[" + this.collectorId + "]");
	// 	}
	//
	// }.bind(this), 1000);

	this.collectorGenerator = function(){
		if(this.collector){
			return this.collector;
		}else{
			var i = randomInt(10,99);
			this.collector = {id: 1, macaddress: "78:2b:cb:c0:75:"+i, name: "Collector-Simulator"+i};
			return this.collector;
		}
	}

	// this.client.connect(8124, '179.106.217.25', function() {
	this.client.connect(8124, '127.0.0.1', function() {
		reportMap.collectorsConnected++;
		this.protocol = new ProtocolConnectionController(this.client, this);
		this.sendObject(buildMessageObject("SYN", this.collectorGenerator()));
	}.bind(this));

	this.client.on('data', function(data) {
		this.protocol.processData(data);
	}.bind(this));

	this.client.on("error", function(err) {
		console.log('PAU NA MÁQUINA: ' + err.toString());
		reportMap.errors.push(err);
	}.bind(this));

	this.client.on('close', function() {
		reportMap.collectorsConnected--;
		reportMap.errors.push("Connection Closed");
		this.client.destroy();
	}.bind(this));

	this.processMessage = function(message){
		switch(message.type){
			case "ACK-SYN":
			this.sendAckMessage(message);
			break;
			case "SYN-ALIVE":
			this.sendAckAliveMessage(message);
			break;
			case "ACK-DATA":
			this.ackdataHandler(message);
			break;
			default:
			console.log("Unknown message type ["+message.type+"]. Ignoring entire message.");
		}
	}

	this.rotatePackage = function(){
		setTimeout(function(){
			this.sendInterval = randomInt(SEND_INTERVAL_MIN, SEND_INTERVAL_MAX);

			for(var i = 0; i < PACKAGES_PER_SEND; i++){
				if(this.xLoops > 0){
					this.xLoops--;
					this.sendRfidDatas();
				}else{
					return;
				}
			}
			this.rotatePackage();
		}.bind(this), this.sendInterval);
	}

	this.sendAckMessage = function(message){
		this.collector = message.data;
		this.sendObject(buildMessageObject("ACK", this.collector));
		this.rotatePackage();
	}

	this.sendAckAliveMessage = function(message){
		this.sendObject(buildMessageObject("ACK-ALIVE", {}));
	}

	this.ackdataHandler = function(message){
		this.totalResponses++;
		reportMap.totalResponsesReceived++;

		var rfidCounter = this.packagesSent[message.data.md5diggest[0]];

		if(rfidCounter){

			this.receivedCouter++;
			reportMap.totalPackagesReceived++;
			reportMap.totalRfidReceived += rfidCounter;

			var delay = this.totalSentPackage - this.receivedCouter;
			// console.log('delay ' + delay);
			if(delay >= 0){
				if(typeof reportMap.delay[delay] === "undefined")
					reportMap.delay[delay] = 0;

				reportMap.delay[delay]++;

				if(this.delayCategory != -1)
					reportMap.delay[this.delayCategory]--;

				// console.log("delayCategory" + this.delayCategory);

				this.delayCategory = delay;

				// console.log("delayCategory" + this.delayCategory);

				// console.log(reportMap.delay);

			}


			delete this.packagesSent[message.data.md5diggest[0]];
		}
		else{
			reportMap.errors.push("The ["+message.data.md5diggest[0]+"] is not in the sent packages. Not a valid diggest reponse for this collector");
		}
	}

	this.sendObject = function(object){
		if(!this.client){
			console.log("sendMessage without socket.")
			return;
		}

		try{
			var message = JSON.stringify(object);
			this.client.write(buildMessage(message));
		}catch(e){
			console.log("this.sendObject error: " + e);
		}
	}

	this.sendRfidDatas = function(){
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
		var qdtPk = randomInt(1, this.maxRFID);


		var totalRFID = qdtPk;
		this.totalSentRfiddata += totalRFID;
		reportMap.totalRfidSent += totalRFID;;

		var data = this.collectorGenerator();
		data.datasummary = {};
		var dt = [];
		while(qdtPk > 0){
			var rfidobj = {};
			rfidobj.identificationcode = "55555" + randomInt(10, 99);
			rfidobj.datetime = new Date();
			dt.push(rfidobj);
			qdtPk--;
		}
		data.datasummary.data = dt;
		data.datasummary.md5diggest = randomchars.uid(32);
		// data.datasummary.md5diggest = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
		this.packagesSent[data.datasummary.md5diggest] = totalRFID;
		this.sentCouter++;
		reportMap.totalPackagesSent++;

		this.sendObject(buildMessageObject("DATA", data));
		this.totalSentPackage++;
	}

};


var randomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

var buildMessage = function(message){
	// console.log(message);
	var size = message.length;
	// console.log(size);
	var newMessage = String('00000000' + size).slice(size.toString().length);
	var newMessage = newMessage.concat(message);
	return newMessage;
};

var buildMessageObject = function(m_type, m_data){
	return {type: m_type, data: m_data, datetime: getTimezonedISODateString()};
};

var getTimezonedISODateString = function(){
	var date = new Date();
	//Subtracts the timezone hours to local time.
	date.setHours(date.getHours() - (date.getTimezoneOffset() / 60) );
	return date.toISOString();
};

var ProtocolConnectionController = function(socket, connectionCtrl){
	if (false === (this instanceof ProtocolConnectionController)) {
		console.log('Warning: ProtocolConnectionController constructor called without "new" operator');
		return;
	}

	this.resetBuffer = function(){
		this.permanentDataBuffer = new Buffer(0);
		this.waitingForRemainingData = false;
		this.packetSize = 0;
	}

	this.resetBuffer();

	this.debug_receivedObjs = 0;
	this.debug_successJsonObjs = 0;
	this.debug_brokenJsonObjs = 0;
	this.debug_ignoredBuffer = 0;

	this.consumeData = function(packet){
		this.debug_receivedObjs++;
		try {
			var message = {};
			message = JSON.parse(packet);
			connectionCtrl.processMessage(message);
			this.debug_successJsonObjs++;
		}catch(e){
			console.log("consumeData error : " +e);
			this.debug_brokenJsonObjs++;
			return;
		}
	}

	this.processDataBuffer = function(){
		if(!this.waitingForRemainingData){
			// console.log("processDataBuffer : Probably a new pkt.");
			//new packet.
			if(! (this.permanentDataBuffer.length >= 8)){
				// console.log("processDataBuffer : We dont have at least 8 bytes. wait more.");
				return;
			}
			var buffer = [];
			buffer = this.permanentDataBuffer.slice(0, 8);
			this.permanentDataBuffer = this.permanentDataBuffer.slice(8, this.permanentDataBuffer.length);
			this.packetSize = parseInt(buffer);

			if(isNaN(this.packetSize)){
				this.debug_ignoredBuffer++;
				// console.log("Sem Banana no buffer...");
				//Package error, incorrect size information. Clear buffer and start over
				this.resetBuffer();
				return;
			}

			// console.log("processDataBuffer : New pkt found with size : " + this.packetSize);
			this.waitingForRemainingData = true;
		}

		// console.log("processDataBuffer : this.permanentDataBuffer.length : " + this.permanentDataBuffer.length);

		if(this.permanentDataBuffer.length < this.packetSize){
			// console.log("processDataBuffer : We dont have all bytes to this packet. wait more.");
			return;
		}

		var data = this.permanentDataBuffer.slice(0, this.packetSize).toString();
		// console.log("data : " + data);
		this.permanentDataBuffer = this.permanentDataBuffer.slice(this.packetSize, this.permanentDataBuffer.length);
		// console.log("processDataBuffer : this.permanentDataBuffer.length : " + this.permanentDataBuffer.length);

		this.packetSize = 0;
		this.waitingForRemainingData = false;
		this.consumeData(data);

		// 	console.log("processDataBuffer : debug_receivedObjs: " + this.debug_receivedObjs +
		// 	" debug_successJsonObjs: " + this.debug_successJsonObjs +
		// 	" debug_brokenJsonObjs: " + this.debug_brokenJsonObjs +
		// 	" debug_ignoredBuffer: " + this.debug_ignoredBuffer
		// );
	}

	this.processData = function(data){

		// console.log("processData : NEW DATA RECEIVED: " + data.toString());

		this.permanentDataBuffer = Buffer.concat([this.permanentDataBuffer, data]);

		do {
			this.processDataBuffer();
			// process.nextTick(this.processDataBuffer);
		}while(this.permanentDataBuffer.length > 8 && !this.waitingForRemainingData)
	}
};

var args = process.argv;

var argConnectionsIndex = args.indexOf('--connections');
var argPackagesIndex = args.indexOf('--packages');
var argRfidIndex = args.indexOf('--rfiddata');
var argPackagePerSendIndex = args.indexOf('--packagePerSend');
var argSendIntervalMinIndex = args.indexOf('--sendIntervalMin');
var argSendIntervalMaxIndex = args.indexOf('--sendIntervalMax');

if(argConnectionsIndex > -1){
	var value = args[argConnectionsIndex+1];
	if(isNaN(value)){
		console.log('Connections quantity is invalid. Aborting.');
		return;
	}

	CONNECTION_QUANTITY = value;
}

if(argPackagesIndex > -1){
	var value = args[argPackagesIndex+1];
	if(isNaN(value)){
		console.log('Packages quantity is invalid. Aborting.');
		return;
	}

	PACKAGES_QUANTITY = value;
}

if(argRfidIndex > -1){
	var value = args[argRfidIndex+1];
	if(isNaN(value)){
		console.log('RFIDDAA max quantity is invalid. Aborting.');
		return;
	}

	RFIDDATA_QUANTITY = value;
}

if(argSendIntervalMinIndex > -1){
	var value = args[argSendIntervalMinIndex+1];
	if(isNaN(value)){
		console.log('SEND_INTERVAL_MIN quantity is invalid. Aborting.');
		return;
	}

	SEND_INTERVAL_MIN = parseInt(value);
}

if(argSendIntervalMaxIndex > -1){
	var value = args[argSendIntervalMaxIndex+1];
	if(isNaN(value)){
		console.log('SEND_INTERVAL_MAX quantity is invalid. Aborting.');
		return;
	}

	SEND_INTERVAL_MAX = parseInt(value);
}

if(argPackagePerSendIndex > -1){
	var value = args[argPackagePerSendIndex+1];
	if(isNaN(value)){
		console.log('PACKAGES_PER_SEND quantity is invalid. Aborting.');
		return;
	}

	PACKAGES_PER_SEND = value;
}

var collectorId = 0;

for(var i = 0; i<CONNECTION_QUANTITY; i++){
	new CollectorConnection(collectorId++);
}

var randomchars = (function() {
	this.randomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	this.uid = function(len) {
		var buf = []
    	, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    	, charlen = chars.length;

		for (var i = 0; i < len; ++i) {
			buf.push(chars[this.randomInt(0, charlen - 1)]);
		}

		return buf.join('');
	}

	return {
		uid: uid,
		randomInt: randomInt
	}
})();
