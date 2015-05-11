var ProtocolController = function(){
	    if (false === (this instanceof ProtocolController)) {
        	console.warn('Warning: ProtocolController constructor called without "new" operator');
        	return;
        }
        
        permanentDataBuffer = new Buffer(0);
        waitingForRemainingData = false;
        packetSize =0;

        /*
        TMP
        */
        var tmp_receivedObjs=0;
        var tmp_successJsonObjs=0;
        var tmp_brokenJsonObjs=0;
        this.getTmpVars = function(){
        	return {received : tmp_receivedObjs, success:tmp_successJsonObjs, broken:tmp_brokenJsonObjs};
        }


        var consumeData = function(data){
        	tmp_receivedObjs++;
        	try {
				message = JSON.parse(data);
				console.log(message);
				tmp_successJsonObjs++;
			}catch(e){
				console.log(e);
				tmp_brokenJsonObjs++;				
				return;
			}
        }

        var processDataBuffer = function(){
        	if(!waitingForRemainingData){
				console.log("RFIDPLATFORM[DEBUG] : Probably a new pkt.");
				//new packet.
				if(! (permanentDataBuffer.length >= 8)){	
					console.log("RFIDPLATFORM[DEBUG] : We dont have at least 8 bytes. wait more.");				
					return;
				}
				var buffer = [];
				buffer = permanentDataBuffer.slice(0, 8);
				permanentDataBuffer = permanentDataBuffer.slice(8, permanentDataBuffer.length);
				packetSize = parseInt(buffer);
				console.log("RFIDPLATFORM[DEBUG] : New pkt found with size : " + packetSize);
				waitingForRemainingData = true;
			}
			console.log("RFIDPLATFORM[DEBUG] : permanentDataBuffer.length : " + permanentDataBuffer.length);
			console.log("RFIDPLATFORM[DEBUG] : permanentDataBuffer string : " + permanentDataBuffer.toString());

			if(permanentDataBuffer.length < packetSize){
				console.log("RFIDPLATFORM[DEBUG] : We dont have all bytes to this packet. wait more.");
				return;
			}

			var data = permanentDataBuffer.slice(0, packetSize).toString();
			console.log("RFIDPLATFORM[DEBUG] : data : " + data);
			permanentDataBuffer = permanentDataBuffer.slice(packetSize, permanentDataBuffer.length);
			console.log("RFIDPLATFORM[DEBUG] : permanentDataBuffer.length : " + permanentDataBuffer.length);
			
			packetSize = 0;
			waitingForRemainingData = false;

			consumeData(data);

			console.log("RFIDPLATFORM[DEBUG] : tmp_receivedObjs: "+tmp_receivedObjs);
			console.log("RFIDPLATFORM[DEBUG] : tmp_successJsonObjs: "+tmp_successJsonObjs);
			console.log("RFIDPLATFORM[DEBUG] : tmp_brokenJsonObjs: "+tmp_brokenJsonObjs);
        }

        this.processData = function(data){
        	
        	console.log("\nRFIDPLATFORM[DEBUG] : NEW DATA RECEIVED: " + data.toString());

	        permanentDataBuffer = Buffer.concat([permanentDataBuffer, data]);

	        do {
	        	processDataBuffer();
	        }while(permanentDataBuffer.length > 8 && !waitingForRemainingData)
        }

        
}

module.exports = ProtocolController;