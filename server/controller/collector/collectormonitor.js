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
var ProtocolMessagesController = require(__base + 'controller/collector/protocolmessages');

/**
* Represents a collector hold in memory in the system.
* Main functionalities are to monitor the collector status against the server.
* Monitor if online or offline.
* @class
*/
var CollectorMonitor = function() {
    var timer;
    var collector;
    var sendSynAliveMessage;
    var closeConnection;
    var status = {
        alive: 'alive',
        unknown: 'unknown'
    };

    /**
    * Stops monitoring a collector.
    * @return {void} clearInterval callback
    * @memberof CollectorMonitor
    */
    var stopMonitor = function(){
        clearInterval(timer);
    }

    /**
    * Action after a timeout.
    * When the collecto does not answer before the timer specified, this function is called.
    * @memberof CollectorMonitor
    * @return {void}
    */
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

    /**
    * Function called to start monitoring a given collector, with specific send and close connection functions.
    * @param  {Object} collectorInfo is the object that contains the collector's data.
    * @param  {function} messager      is the function to send a syn-alive message to the collector.
    * @param  {function} closeCon      is the function to close the collector's connection.
    * @return {void}
    */
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

    /**
    * Function called when the collector is detected as online.
    * @return {void}
    */
    this.setAlive = function(){
        logger.debug("RFIDPLATFORM[DEBUG]: Collector " + collector.mac + " is alive.");
        collector.status = status.alive;
    };
};

module.exports = CollectorMonitor;
