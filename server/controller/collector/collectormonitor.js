'use strict';
var logger = require('winston');
var ProtocolMessagesController = require(__base + 'controller/collector/protocolmessages');

var CollectorMonitor = function() {
  var timer;
  var collector;
  var sendSynAliveMessage;
  var closeConnection;
  var status = {
    alive: 'alive',
    unknown: 'unknown'
  };

  var stopMonitor = function(){
    clearInterval(timer);
  }

  var collectorTimeout = function(){
    if(collector.status === status.unknown){
    // if the server sent a message and the collector did not answer
    // the server must close the connection
    // logger.info("RFIDPLATFORM[DEBUG]: Timeout: collector inactive for too much time, closing connection with: " + socketInfo.address);

      try{
        stopMonitor();
        //Close the connection with the socket.
        closeConnection();
        return;
      }catch(e){
          logger.error("RFIDPLATFORM[DEBUG]: ERROR When trying to close the connection " + e);
      }
    }

    if(collector.status === status.alive){
      //if the status is alive, so change it to 'unknown' and send the SYN-ALIVE message
      collector.status = status.unknown;
      try{
        //Send an ACK-ALIVE message to the collector.
        sendSynAliveMessage();
      }catch(e){
        logger.error("RFIDPLATFORM[DEBUG]: ERROR When trying to send a message " + e);
      }
    }
  }

  this.startMonitor = function(collectorInfo, messager, closeCon) {
    sendSynAliveMessage = messager;
    closeConnection = closeCon;
    collector = collectorInfo;
    //Set the first status as alive.
    collector.status = status.alive;
    logger.debug("New collector attached. Starting monitoring. ");
    timer = setInterval(function() {
        collectorTimeout();
    }, 5000);
  };

  this.setAlive = function(){
    logger.debug("RFIDPLATFORM[DEBUG]: Collector " + collector.mac + " is alive.");
    collector.status = status.alive;
  };
};

module.exports = CollectorMonitor;
