var ProtocolMessagesController = require('./protocol-messages');
var logger = require('winston');
var PlatformError = require('../utils/platformerror');

var ProtocolConnectionController = function(socket, setOnlineCollector){
	    if (false === (this instanceof ProtocolConnectionController)) {
        	logger.warn('Warning: ProtocolConnectionController constructor called without "new" operator');
        	return;
        }

        var protocolmessages =  new ProtocolMessagesController(socket, setOnlineCollector);

        var resetBuffer = function(){
            permanentDataBuffer = new Buffer(0);
            waitingForRemainingData = false;
            packetSize = 0;
        }
        
        resetBuffer();

        var debug_receivedObjs=0;
        var debug_successJsonObjs=0;
        var debug_brokenJsonObjs=0;

        var consumeData = function(packet){
        	debug_receivedObjs++;
        	try {
				var message = {};
				message = JSON.parse(packet);
				protocolmessages.processMessage(message);
				debug_successJsonObjs++;
			}catch(e){
				logger.error("consumeData error : " +e);
				debug_brokenJsonObjs++;				
				return;
			}
        }

        var processDataBuffer = function(){
            if(!waitingForRemainingData){
                logger.debug("processDataBuffer : Probably a new pkt.");
                //new packet.
    			if(! (permanentDataBuffer.length >= 8)){	
    				logger.debug("processDataBuffer : We dont have at least 8 bytes. wait more.");				
    				return;
    			}
                var buffer = [];
                buffer = permanentDataBuffer.slice(0, 8);
                permanentDataBuffer = permanentDataBuffer.slice(8, permanentDataBuffer.length);
                packetSize = parseInt(buffer);

                if(isNaN(packetSize)){

                    logger.error("Sem Banana no buffer...");
                    // Package error, incorrect size information. Clear buffer and start over
                    resetBuffer();
                    return;
                }

                logger.debug("processDataBuffer : New pkt found with size : " + packetSize);
                waitingForRemainingData = true;
            }

            logger.debug("processDataBuffer : permanentDataBuffer.length : " + permanentDataBuffer.length);

            if(permanentDataBuffer.length < packetSize){
            	logger.debug("processDataBuffer : We dont have all bytes to this packet. wait more.");
            	return;
            }

            var data = permanentDataBuffer.slice(0, packetSize).toString();
            logger.debug("data : " + data);
            permanentDataBuffer = permanentDataBuffer.slice(packetSize, permanentDataBuffer.length);
            logger.debug("processDataBuffer : permanentDataBuffer.length : " + permanentDataBuffer.length);

            packetSize = 0;
            waitingForRemainingData = false;

            consumeData(data);

            logger.debug("processDataBuffer : debug_receivedObjs: "+debug_receivedObjs +
                " debug_successJsonObjs: "+debug_successJsonObjs +
                " debug_brokenJsonObjs: "+debug_brokenJsonObjs
            );
        }

        this.processData = function(data){
        	
        	logger.debug("processData : NEW DATA RECEIVED: " + data.toString());

	        permanentDataBuffer = Buffer.concat([permanentDataBuffer, data]);

	        do {
	        	processDataBuffer();
	        }while(permanentDataBuffer.length > 8 && !waitingForRemainingData)
        }      
}

module.exports = ProtocolConnectionController;