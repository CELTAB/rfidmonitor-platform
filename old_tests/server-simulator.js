var net = require('net');
var logger = require('winston');
var SequelizeClass = require('sequelize');
var sequelize = require('../server/controller/database/platformsequelize');

var protocol = null;

var server = net.createServer();
var socket = null;
server.on('connection', function(sk){

  protocol = new ProtocolConnectionController(sk);
  socket = sk;

  socket.on('data', function(data){
    // console.log(data);
    protocol.processData(data);
  });

  socket.on('error', function(error){
    console.log('error: ' + error);
  });

  socket.on('close', function(data){
    console.log('close');
  });
});

server.listen(8124, function(){
  console.log('Listen on port 8124');
});

var buildMessage = function(message){
	var size = message.length;
	var newMessage = String('00000000' + size).slice(size.toString().length);
	var newMessage = newMessage.concat(message);
	return newMessage;
}

var createModelPackage = function(){
  var SequelizeClass = require('sequelize');

  var model = sequelize.define("Package", {
    packageHash:{
      type: SequelizeClass.STRING,
      allowNull : false
    },
    packageSize:{
      type: SequelizeClass.INTEGER,
      allowNull : false
    }
  },
  {
    paranoid : true,
    freezeTableName: true,
    tableName: 'tb_plat_package'
  });
}

var createModelRfid = function(){

  // var sequelize = require(__base + 'controller/database/platformsequelize');
  // var Collector = require(__base + 'models/collector');
  // var Package = require(__base + 'models/package');
  var Package = sequelize.model('Package');

  var model = sequelize.define("Rfiddata", {
    rfidCode:{
      type : SequelizeClass.STRING,
      allowNull : false,
    },
    extraData:{
      type : SequelizeClass.STRING,
      allowNull : true
    },
    rfidReadDate:{
      type: SequelizeClass.DATE,
      allowNull: false
    },
    serverReceivedDate:{
      type: SequelizeClass.DATE,
      allowNull: false
    }
  },
  {
    paranoid : true,
    freezeTableName: true,
    tableName: 'tb_plat_rfiddata'
  });

  model.belongsTo(Package, {foreignKey: {name: 'packageId', allowNull: false}});

  //OBJECT EXAMPLE
  /*
  {
   // Goes here
  }
  */
}

createModelPackage();
createModelRfid();

sequelize.sync();

var c = 0;
var b = 0;
var a = 0;
var processMessage = function(message){
	console.log("Chegou dado: " + c++);
  //
	// var permanentDataBuffer = message;
	// var packetSize = parseInt(permanentDataBuffer.slice(0, 8));
	// permanentDataBuffer = permanentDataBuffer.slice(8, permanentDataBuffer.length);
	// if(isNaN(packetSize)){
	// 		logger.error("Sem Banana no buffer...");
	// 		return;
	// }
  //
	// var data = permanentDataBuffer.slice(0, packetSize).toString();
	// var message = {};
	// message = JSON.parse(data);

	switch(message.type){
		case "SYN":
			// sendAckMessage(message);
			break;
		case "ACK-ALIVE":
			// sendAckAliveMessage(message);
			break;
		case "DATA":


      var Package = sequelize.model('Package');
      var Rfid = sequelize.model('Rfiddata');

      var getTimezonedISODateString = function(){
      	var date = new Date();
      	//Subtracts the timezone hours to local time.
      	date.setHours(date.getHours() - (date.getTimezoneOffset() / 60) );
      	return date.toISOString();
      }

      var buildMessageObject = function(m_type, m_data){
      	return {type: m_type, data: m_data, datetime: getTimezonedISODateString()};
      }

      var sendObject = function(object){

      	try{
      		var message = JSON.stringify(object);
      		// console.log("sendMessage : " + message);

      		// if(client.isConnected){
      			// console.log('sending data');
            console.log("Devolveu dado: " + b++);
      			socket.write(buildMessage(message));
      		// }

      	}catch(e){
      		console.log("sendObject error: " + e);
      	}
      }

      var callback = function(err, vai){
        if(err){
          console.log(err);
          return;
        }

        // console.log('foi');
        sendObject(buildMessageObject('ACK-DATA', {md5diggest: [vai]}));
        // console.log(vai);
      }

      var rfiddata = message.data.datasummary;
      // console.log(rfiddata);

      var pack = {
        packageHash: rfiddata.md5diggest,
        packageSize: rfiddata.data.length
      };

      Package.create(pack)
      .then(function(newPk){

        var insert = function(rfid, callback){
          var obj = {};
          obj.rfidCode = rfid.identificationcode;
          obj.rfidReadDate = rfid.datetime;
          obj.serverReceivedDate = new Date();
          // obj.collectorId = collector.id;
          obj.packageId = newPk.id;

          Rfid.create(obj).then(function(newRfid){
            callback(null, newPk.packageHash);
          });
        };
        var datas = rfiddata.data;
        var index = 0;

        var next = function(err){
          if(err)
            return callback(err);

          if(datas[index]){
            var rfid = datas[index];
            index++;
            insert(rfid, next);
          }else{
            return callback(null, newPk.packageHash);
          }
        }
        next();
      });
      console.log("Mandou salvar: " + a++);
			// ackdataHandler(message);
			break;
		default:
			logger.warn("Unknown message type ["+message.type+"]. Ignoring entire message.");
	}
}

var ProtocolConnectionController = function(socket){
	    if (false === (this instanceof ProtocolConnectionController)) {
        	logger.warn('Warning: ProtocolConnectionController constructor called without "new" operator');
        	return;
        }

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

        processMessage(message);

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

          // console.log('oi');
        	logger.silly("processData : NEW DATA RECEIVED: " + data.toString());

	        permanentDataBuffer = Buffer.concat([permanentDataBuffer, data]);

	        do {
	        	this.processDataBuffer();
	        }while(permanentDataBuffer.length > 8 && !waitingForRemainingData)
        }
}
