'use strict';
var logger = require('winston');
var ProtocolMessagesController = require(__base + 'controller/collector/protocolmessages');
var PlatformError = require(__base + 'utils/platformerror');

var ProtocolConnectionController = function(socket, setOnlineCollector){
  if (false === (this instanceof ProtocolConnectionController)) {
  	logger.warn('Warning: ProtocolConnectionController constructor called without "new" operator');
  	return;
  }

  //Initialzacion
  var permanentDataBuffer = new Buffer(0);
  var waitingForRemainingData = false;
  var packetSize = 0;

  this.protocolmessages = new ProtocolMessagesController(socket, setOnlineCollector);

  this.resetBuffer = function(){
    permanentDataBuffer = new Buffer(0);
    waitingForRemainingData = false;
    packetSize = 0;
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
			this.protocolmessages.processMessage(message);
			this.debug_successJsonObjs++;
		}catch(e){
			logger.error("consumeData error : " +e);
			this.debug_brokenJsonObjs++;
			return;
		}
  }

  this.processDataBuffer = function(){
      if(!waitingForRemainingData){
        logger.silly("processDataBuffer : Probably a new pkt.");
        //new packet.
    		if(! (permanentDataBuffer.length >= 8)){
    			logger.silly("processDataBuffer : We dont have at least 8 bytes. wait more.");
    			return;
    		}
        var buffer = [];
        buffer = permanentDataBuffer.slice(0, 8);
        permanentDataBuffer = permanentDataBuffer.slice(8, permanentDataBuffer.length);
        packetSize = parseInt(buffer);

        if(isNaN(packetSize)){
            this.debug_ignoredBuffer++;
            logger.error("Sem Banana no buffer...");
            // Package error, incorrect size information. Clear buffer and start over
            this.resetBuffer();
            return;
        }

        logger.silly("processDataBuffer : New pkt found with size : " + packetSize);
        waitingForRemainingData = true;
      }

      logger.silly("processDataBuffer : permanentDataBuffer.length : " + permanentDataBuffer.length);

      if(permanentDataBuffer.length < packetSize){
      	logger.silly("processDataBuffer : We dont have all bytes to this packet. wait more.");
      	return;
      }

      var data = permanentDataBuffer.slice(0, packetSize).toString();
      logger.silly("data : " + data);
      permanentDataBuffer = permanentDataBuffer.slice(packetSize, permanentDataBuffer.length);
      logger.silly("processDataBuffer : permanentDataBuffer.length : " + permanentDataBuffer.length);

      packetSize = 0;
      waitingForRemainingData = false;

      this.consumeData(data);

      logger.debug("processDataBuffer : debug_receivedObjs: " + this.debug_receivedObjs +
          " debug_successJsonObjs: " + this.debug_successJsonObjs +
          " debug_brokenJsonObjs: " + this.debug_brokenJsonObjs +
          " debug_ignoredBuffer: " + this.debug_ignoredBuffer
      );
  }

  this.processData = function(data){
  	logger.silly("processData : NEW DATA RECEIVED: " + data.toString());
    permanentDataBuffer = Buffer.concat([permanentDataBuffer, data]);
    do {
    	this.processDataBuffer();
    }while(permanentDataBuffer.length > 8 && !waitingForRemainingData)
  }
}

module.exports = ProtocolConnectionController;
