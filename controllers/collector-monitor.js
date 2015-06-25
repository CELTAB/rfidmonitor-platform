var ProtocolMessagesController = require('./protocol-messages');
var logger = require('winston');

var timer;
var collector;

var sendAckAliveMessage;
var closeConnection;

var CollectorMonitor = function() {

}

CollectorMonitor.prototype.startMonitor = function(collectorInfo, messager, closeCon) {	

    sendAckAliveMessage = messager;
    closeConnection = closeCon;

    collector = collectorInfo;
    //Set the first status as alive.
    collector.status = 'alive';

    logger.info("New collector attached. Starting monitoring. " + JSON.stringify(collector));

    timer = setInterval(function() {
        collectorTimeout();
    }, 5000);
}

var stopMonitor = function(){
    clearInterval(timer);
}

var collectorTimeout = function(){

        if(collector.status == 'unknown'){
            // if the server sent a message and the collector did not answer
            // the server must close the connection
            // logger.info("RFIDPLATFORM[DEBUG]: Timeout: collector inactive for too much time, closing connection with: " + socketInfo.address);
                
            try{                  
                //Close the connection with the socket.  
                closeConnection();
                CollectorMonitor.prototype.stopMonitor();
            }catch(e){
                logger.error("RFIDPLATFORM[DEBUG]: ERROR When trying to close the connection " + e);
            }
        }

        if(collector.status == 'alive'){
            //if the status is alive, so change it to 'unknown' and send the SYN-ALIVE message
            collector.status = 'unknown';                           
            try{        
                //Send an ACK-ALIVE message to the collector.            
                sendAckAliveMessage();
            }catch(e){
            logger.error("RFIDPLATFORM[DEBUG]: ERROR When trying to send a message " + e);
        }
    }
}

CollectorMonitor.prototype.setAlive = function(){
    logger.info("RFIDPLATFORM[DEBUG]: Collector " + collector.macaddress + " is alive.");
    collector.status = 'alive';
}

module.exports = CollectorMonitor;