var ProtocolMessagesController = require('./protocol-messages')

var ProtocolConnectionController = function(socket, setOnlineCollector){
	    if (false === (this instanceof ProtocolConnectionController)) {
        	console.warn('Warning: ProtocolConnectionController constructor called without "new" operator');
        	return;
        }

        var protocolmessages =  new ProtocolMessagesController(socket, setOnlineCollector);
        
        permanentDataBuffer = new Buffer(0);
        waitingForRemainingData = false;
        packetSize =0;

        /*
        TMP
        */
        // var tmp_receivedObjs=0;
        // var tmp_successJsonObjs=0;
        // var tmp_brokenJsonObjs=0;

        // this.getTmpVars = function(){
        // 	return {received : tmp_receivedObjs, success:tmp_successJsonObjs, broken:tmp_brokenJsonObjs};
        // }

        //##
        //start of temporary code below.
        //##
        
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
        
        var consumeData_unwantedFormat = function(packet){

        	if( (packet.indexOf("}\n{")) == -1){
        		//normal format. Just process.
        		consumeData(packet);
        	}else{
        		console.log("WARNING: Wrong message format found");
        		//wrong format found.
        		try{
	        		packet = JSON.parse("[" + replaceAll(packet, "}\n{","},\n{") + "]");

	        		packet.forEach(function(pkt){
	        			consumeData(JSON.stringify(pkt));
	        		});

        		}catch(e){
        			console.log("consumeData_unwantedFormat error : " + e);
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
        	tmp_receivedObjs++;
        	try {
				var message = {};
				message = JSON.parse(packet);
				protocolmessages.processMessage(message);
				tmp_successJsonObjs++;
			}catch(e){
				console.log("consumeData error : " +e);
				tmp_brokenJsonObjs++;				
				return;
			}
        }

        var processDataBuffer = function(){
        	if(!waitingForRemainingData){
				// console.log("RFIDPLATFORM[DEBUG] : Probably a new pkt.");
				//new packet.
				if(! (permanentDataBuffer.length >= 8)){	
					// console.log("RFIDPLATFORM[DEBUG] : We dont have at least 8 bytes. wait more.");				
					return;
				}
				var buffer = [];
				buffer = permanentDataBuffer.slice(0, 8);
				permanentDataBuffer = permanentDataBuffer.slice(8, permanentDataBuffer.length);
				packetSize = parseInt(buffer);
				// console.log("RFIDPLATFORM[DEBUG] : New pkt found with size : " + packetSize);
				waitingForRemainingData = true;
			}
			// console.log("RFIDPLATFORM[DEBUG] : permanentDataBuffer.length : " + permanentDataBuffer.length);
			// console.log("RFIDPLATFORM[DEBUG] : permanentDataBuffer string : " + permanentDataBuffer.toString());

			if(permanentDataBuffer.length < packetSize){
				// console.log("RFIDPLATFORM[DEBUG] : We dont have all bytes to this packet. wait more.");
				return;
			}

			var data = permanentDataBuffer.slice(0, packetSize).toString();
			// console.log("RFIDPLATFORM[DEBUG] : data : " + data);
			permanentDataBuffer = permanentDataBuffer.slice(packetSize, permanentDataBuffer.length);
			// console.log("RFIDPLATFORM[DEBUG] : permanentDataBuffer.length : " + permanentDataBuffer.length);
			
			packetSize = 0;
			waitingForRemainingData = false;

			// consumeData(data);
			consumeData_unwantedFormat(data);

			// console.log("RFIDPLATFORM[DEBUG] : tmp_receivedObjs: "+tmp_receivedObjs);
			// console.log("RFIDPLATFORM[DEBUG] : tmp_successJsonObjs: "+tmp_successJsonObjs);
			// console.log("RFIDPLATFORM[DEBUG] : tmp_brokenJsonObjs: "+tmp_brokenJsonObjs);
        }

        this.processData = function(data){
        	
        	// console.log("\nRFIDPLATFORM[DEBUG] : NEW DATA RECEIVED: " + data.toString());

	        permanentDataBuffer = Buffer.concat([permanentDataBuffer, data]);

	        do {
	        	processDataBuffer();
	        }while(permanentDataBuffer.length > 8 && !waitingForRemainingData)
        }

        
}

module.exports = ProtocolConnectionController;