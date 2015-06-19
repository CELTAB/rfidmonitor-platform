var ProtocolMessagesController = require('./protocol-messages');
var logger = require('winston');

var ProtocolConnectionController = function(socket, setOnlineCollector){
	    if (false === (this instanceof ProtocolConnectionController)) {
        	logger.warn('Warning: ProtocolConnectionController constructor called without "new" operator');
        	return;
        }

        var protocolmessages =  new ProtocolMessagesController(socket, setOnlineCollector);
        
        permanentDataBuffer = new Buffer(0);
        waitingForRemainingData = false;
        packetSize =0;

        var debug_receivedObjs=0;
        var debug_successJsonObjs=0;
        var debug_brokenJsonObjs=0;

        // this.getTmpVars = function(){
        // 	return {received : debug_receivedObjs, success:debug_successJsonObjs, broken:debug_brokenJsonObjs};
        // }

        //##
        //start of temporary code below.
        //##       
        
        var consumeData_unwantedFormat = function(packet){
        /*
        	This is a temporary function that handles an unwanted format of comming bytes.
        	Bytes can come in 2 formats:
        	 1) "00000{obj}"
        	 2) "00000{obj}{obj}{obj}"

        	 The second way is wrong (not a valid json). Should be in array format:
        	  - "00000[{obj},{obj},{obj}]"

        	 This problem is caused by a flush problem in the IPC communication into collecting point. Solving
        	 that makes this function unnecessary. But solving that consumes tons of hours changing lot of logic.

        	 For now, this is a very fast and simple solution (also known as gambiarra) that should be fixed some day (or not).

        */

        	if( (packet.indexOf("}\n{")) == -1){
        		//normal format. Just process.
        		consumeData(packet);
        	}else{
        		logger.warn("Wrong message format found");
        		//wrong format found.
        		try{
	        		packet = JSON.parse("[" + replaceAll(packet, "}\n{","},\n{") + "]");

	        		packet.forEach(function(pkt){
	        			consumeData(JSON.stringify(pkt));
	        		});

        		}catch(e){
        			logger.error("consumeData_unwantedFormat error : " + e);
        		}        		
        	}
        }

        var replaceAll = function(string, find, replace) {
	       return string.replace(new RegExp(find, 'g'), replace);
	}
	//##
	//end of temporary code above.
	//##


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
                logger.debug("processDataBuffer : New pkt found with size : " + packetSize);
                waitingForRemainingData = true;
            }

            logger.debug("processDataBuffer : permanentDataBuffer.length : " + permanentDataBuffer.length);
            logger.debug("processDataBuffer : permanentDataBuffer string : " + permanentDataBuffer.toString());

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

            // consumeData(data);
            consumeData_unwantedFormat(data);

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