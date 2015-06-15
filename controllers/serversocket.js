var ProtocolMessagesController = require('./protocol-messages')

var SocketController = function() {

	var protocolmessages = new ProtocolMessagesController();

	this.socketList = {};

	this.socketTimeout = function() {			
        for(var key in this.socketList){
        	// console.log("RFIDPLATFORM[DEBUG]: Collector address: " +this.socketList[key].address );
        	var socketInfo = this.socketList[key];

        	if(socketInfo.status == 'unknown'){
        		// if the server sent a message and the collector did not answer
        		// the server must close the connection
    			// console.log("RFIDPLATFORM[DEBUG]: Timeout: collector inactive for too much time, closing connection with: " + socketInfo.address);
        		
        		try{	        		
            		socketInfo.socket.emit('end');	
            		socketInfo.socket.end();
        		}catch(e){
        			console.log("RFIDPLATFORM[DEBUG]: ERROR When trying to close the connection " + e);
        		}
        		
        		delete this.socketList[socketInfo.address];
        	}

        	if(socketInfo.status == 'alive'){
            	socketInfo.status = 'unknown';   	                 	
        		try{	        		
            		socketInfo.socket.write(protocolmessages.buildMessageSYNALIVE());

            		// socketInfo.socket.emit('end');	
            		// socketInfo.socket.end();
        		}catch(e){
        			console.log("RFIDPLATFORM[DEBUG]: ERROR When trying to send a message " + e);
        		}
        	}
        }

        setTimeout((function() {
	        this.socketTimeout();
        }).bind(this), 5000);
    }

    this.setAlive = function(macAddress){
    	// console.log("RFIDPLATFORM[DEBUG]: Collector " + macAddress + " is alive.");
    	this.socketList[macAddress].status = 'alive';
    }

    this.setUnknown = function(macAddress){
    	this.socketList[macAddress].status = 'unknown';
    }
}

module.exports = SocketController;