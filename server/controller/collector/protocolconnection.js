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
var PlatformError = require(__base + 'utils/platformerror');

/**
* Controlls the communication with the collectors using an high level protocol.
* @param {Object} socket             Socket connection with a specific collector.
* @param {function} setOnlineCollector Function that should be called when the collector completes
* the connection (high level handshake), and then is considered online.
* @class
*/
var ProtocolConnectionController = function(socket, setOnlineCollector){
    if (false === (this instanceof ProtocolConnectionController)) {
        logger.warn('Warning: ProtocolConnectionController constructor called without "new" operator');
        return;
    }

    /**
    * Holds every byte received in the connection.
    * @type {Buffer}
    */
    var permanentDataBuffer = new Buffer(0);

    /**
    * Holds the flag, the protocol needs to wait more bytes to read a complete message.
    * @type {Boolean}
    */
    var waitingForRemainingData = false;

    /**
    * Holds the message size detected.
    * @type {Number}
    */
    var packetSize = 0;

    /**
    * Instance of the ProtocolMessagesController, that handles the messages at more high level.
    * @type {ProtocolMessagesController}
    */
    this.protocolmessages = new ProtocolMessagesController(socket, setOnlineCollector);

    /**
    * Erase the buffers, and reset the controll variables.
    */
    this.resetBuffer = function(){
        permanentDataBuffer = new Buffer(0);
        waitingForRemainingData = false;
        packetSize = 0;
    }

    this.resetBuffer();
    /**
    * Debugging variable.
    * @type {Number}
    */
    this.debug_receivedObjs = 0;
    /**
    * Debugging variable.
    * @type {Number}
    */
    this.debug_successJsonObjs = 0;
    /**
    * Debugging variable.
    * @type {Number}
    */
    this.debug_brokenJsonObjs = 0;
    /**
    * Debugging variable.
    * @type {Number}
    */
    this.debug_ignoredBuffer = 0;

    /**
    * Handles a number of bytes that should correspond to a complete protocol message.
    * @param  {Buffer} packet bytes that should be an message.
    * @return {void}
    */
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

    /**
    * Called when there are enough bytes available in the buffer, that can be processed. Tries to find
    * a message specified by a size, and when it is gotten, the consumeData function is called.
    * @return {void} Nothing
    */
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
        " debug_ignoredBuffer: " + this.debug_ignoredBuffer);
    }

    /**
    * Called when there are more bytes available from the socket connection.
    * Inject in the permanentDataBuffer the new bytes, and call processDataBuffer while there is
    * enough bytes to be processed.
    * @param  {Bytes} data the new bytes received. Does not represent anything yet.
    * @return {void}
    */
    this.processData = function(data){
        logger.silly("processData : NEW DATA RECEIVED: " + data.toString());
        permanentDataBuffer = Buffer.concat([permanentDataBuffer, data]);
        do {
            this.processDataBuffer();
        }while(permanentDataBuffer.length > 8 && !waitingForRemainingData)
    }
}

module.exports = ProtocolConnectionController;
