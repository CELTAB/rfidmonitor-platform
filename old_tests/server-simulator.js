var net = require('net');
var q = require('q');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Sequelize = require('sequelize');
var pg = require('pg');

mongoose.connect('mongodb://localhost/serversimulator');

var postgresConnectionString = 'postgres://rfidplatform:rfidplatform@localhost:5432/serversimulator';
var sequelize = new Sequelize(postgresConnectionString, {logging : false});

var server = net.createServer();


server.on('connection', function(sk){

  var protocol = new ProtocolConnectionController(sk);
  var socket = sk;

  socket.on('data', function(data){
    protocol.processData(data);
  });

  socket.on('error', function(error){
    console.log('error: ' + error);
    console.log(error);
    console.log(error.toString());
  });

  socket.on('close', function(data){
    console.log('close');
  });
});

server.listen(8124, function(){
  console.log('Listen on port 8124');
});

server.on('error', function(err){
  console.log(err);
});


var db = {};
db.query = function(text, values, cb) {
  pg.connect(postgresConnectionString, function(err, client, done) {
    if (err)
    cb(err, null);
    else
    client.query(text, values, function(err, result) {
      done();
      cb(err, result);
    })
  });
}


//-- MONGOOSE MODELS
var Collector = mongoose.model('Collector',
{
  mac: {type: String , required : true}
});

var Package = mongoose.model('Package',
{
  packageHash: {type: String , required : true},
  packageSize: {type: Number , required : true}
});


var Rfiddata = mongoose.model("Rfiddata", {
  rfidCode:{type: String , required : true},
  extraData:{type: String , required : true},
  rfidReadDate:{type: Date , required : true},
  serverReceivedDate:{type: Date , required : true},
  packageId: { type: Schema.Types.ObjectId, ref: 'Package'}
});
//-- end of - MONGOOSE MODELS

//-- SEQUELIZE MODELS
var CollectorSeq = sequelize.define('Collector', {
  mac: {type: Sequelize.STRING, allowNull : false}
});
var PackageSeq = sequelize.define('Package', {
  packageHash: {type: Sequelize.STRING, allowNull : false},
  packageSize: {type: Sequelize.INTEGER, allowNull : false}
});
var RfiddataSeq = sequelize.define('Rfiddata', {
  rfidCode:{type: Sequelize.STRING , allowNull : false},
  extraData:{type: Sequelize.STRING , allowNull : false},
  rfidReadDate:{type: Sequelize.DATE , allowNull : false},
  serverReceivedDate:{type: Sequelize.DATE , allowNull : false},
  packageId: {
    type: Sequelize.INTEGER,
    references: {
      model: sequelize.model('Package'),
      key:   "id"
    }
  }
});
sequelize.sync();
//-- end of - SEQUELIZE MODELS


var buildMessage = function(message){
  var size = message.length;
  var newMessage = String('00000000' + size).slice(size.toString().length);
  var newMessage = newMessage.concat(message);
  return newMessage;
}

var getTimezonedISODateString = function(){
  var date = new Date();
  //Subtracts the timezone hours to local time.
  date.setHours(date.getHours() - (date.getTimezoneOffset() / 60) );
  return date.toISOString();
}

var sendObject = function(socket, object){
  try{
    var message = JSON.stringify(object);
    socket.write(buildMessage(message));
  }catch(e){
    console.log("sendObject error: " + e);
  }
}
var buildMessageObject = function(m_type, m_data){
  return {type: m_type, data: m_data, datetime: getTimezonedISODateString()};
}

var insertLevelFinish = 0;
var insertLevel1 = 0;
var insertLevel2 = 0;
var insertLevel3 = 0;
var insertLevel4 = 0;

setInterval(function(){
  console.log("insertLevelFinish: " + insertLevelFinish);
  console.log("insertLevel1: " + insertLevel1);
  console.log("insertLevel2: " + insertLevel2);
  console.log("insertLevel3: " + insertLevel3);
  console.log("insertLevel4: " + insertLevel4);
}, 1000);

var finishedInsertingPackage = function(socket, errArray, md5diggest){
  insertLevelFinish++;
  if(errArray.length > 0){
    return console.log(errArray);
  }

  sendObject(socket, buildMessageObject("ACK-DATA", {'md5diggest' : [md5diggest]}));
}

//simulate assync checking.
var macMap = {};

var insertRfiddataFromPackageMongoose = function(socket, pack, rfidArray){

  var rfidInsertCounter = rfidArray.length;
  var rfidInsertErrors = [];

  rfidArray.forEach(function(rfidElem){

    var obj = {};
    obj.rfidCode = rfidElem.identificationcode;
    obj.rfidReadDate = rfidElem.datetime;
    obj.serverReceivedDate = new Date();
    obj.packageId = pack.id;
    obj.extraData = 'nothing';

    var r = new Rfiddata(obj);

    r.save(function(err, newRfid){
      rfidInsertCounter--;
      if(err){
        rfidInsertErrors.push(err);
        console.log(err);
      }
      if(rfidInsertCounter == 0){
        finishedInsertingPackage(socket, rfidInsertErrors, pack.packageHash);
      }
    });

  });

}

var insertPackageFromMessageMongoose = function(socket, collec, message){
  var rfiddata = message.data.datasummary;
  Package.findOne({ packageHash : rfiddata.md5diggest}, function(err, pack){
    if(err)
    return console.log(err);

    if(!pack){
      var pack = new Package({
        packageHash: rfiddata.md5diggest,
        packageSize: rfiddata.data.length
      });

      pack.save(function(err, newPack){
        if(err)
        return console.log(err);
        insertRfiddataFromPackageMongoose(socket, newPack, rfiddata.data);
      });

    }
    else{
      console.log("Package já existe. Não será inserido");
      finishedInsertingPackage(socket, [], rfiddata.md5diggest);
    }
  });
}



var processReceivedDataMongoose = function(socket, message){
  var mac = message.data.macaddress;

  Collector.findOne({ mac : mac}, function(err, collec){
    if(err)
    return console.log(err);

    if(!collec && !macMap[mac]){
      macMap[mac] = mac;
      var collec = new Collector({
        'mac': mac
      });

      collec.save(function(err, newCollec){
        if(err)
        return console.log(err);

        insertPackageFromMessageMongoose(socket, newCollec, message);
      });

    }
    else
    insertPackageFromMessageMongoose(socket, collec, message);
  });

};

var insertRfiddataFromPackageSequelize = function(socket, pack, rfidArray){

  var rfidInsertCounter = rfidArray.length;
  var rfidInsertErrors = [];

  sequelize.transaction(function(t){
    var deferred = q.defer();

    for (var i=0;i<rfidArray.length;i++){

      var rfidElem = rfidArray[i];

      var obj = {};
      obj.rfidCode = rfidElem.identificationcode;
      obj.rfidReadDate = rfidElem.datetime;
      obj.serverReceivedDate = new Date();
      obj.packageId = pack.id;
      obj.extraData = 'nothing';

      RfiddataSeq.create(obj, {transaction: t}).then(function(newRfid){
        rfidInsertCounter--;
        if(rfidInsertCounter == 0){
          finishedInsertingPackage(socket, rfidInsertErrors, pack.packageHash);
          deferred.resolve(true);
        }
        insertLevel4++;
        // return {newRfid.get({plain:true}), {transaction:t}};
      }).catch(function(error){
        insertLevel4++;
        rfidInsertCounter--;
        rfidInsertErrors.push(error);
        console.log(error);
        if(rfidInsertCounter == 0){
          finishedInsertingPackage(socket, rfidInsertErrors, pack.packageHash);
          throw new Error('Rollback please');
        }
      });
    }

    return deferred.promise;

  }).then(function(result){
    console.log(result);
    // t.commit();
  }).catch(function(err){
    console.log(err);
    // t.rollback();
  });

  insertLevel3++;

}

var insertPackageFromMessageSequelize = function(socket, collec, message){
  var rfiddata = message.data.datasummary;
  PackageSeq.create({
    packageHash: rfiddata.md5diggest,
    packageSize: rfiddata.data.length
  }).then(function(newPack){
    insertRfiddataFromPackageSequelize(socket, newPack, rfiddata.data);
  })
  .catch(function(err){
    if(err.name === "SequelizeUniqueConstraintError"){
      console.log("Package já existe. Não será inserido");
      finishedInsertingPackage(socket, [], rfiddata.md5diggest);
      return;
    }
    console.log(err);
  });
  insertLevel2++;

  // var rfiddata = message.data.datasummary;
  //
  // PackageSeq.findOne({where : { packageHash : rfiddata.md5diggest}}).then(function(pack){
  //   if(!pack){
  //     PackageSeq.create({
  //       packageHash: rfiddata.md5diggest,
  //       packageSize: rfiddata.data.length
  //     }).then(function(newPack){
  //       insertRfiddataFromPackageSequelize(socket, newPack, rfiddata.data);
  //     })
  //     .catch(function(err){
  //       console.log(err);
  //     });
  //   }
  //   else{
  //     console.log("Package já existe. Não será inserido.");
  //   finishedInsertingPackage(socket, [], rfiddata.md5diggest);
  // }
  //
  // }).catch(function(error){
  //   console.log(error);
  // });
  //
  // insertLevel2++;

}



var processReceivedDataSequelize = function(socket, message){
  var mac = message.data.macaddress;

  CollectorSeq.findOne({where : {'mac' : mac} })
  .then(function(collec){

    if(!collec && !macMap[mac]){
      macMap[mac] = mac;

      CollectorSeq.create({
        'mac': mac
      }).then(function(newCollec){
        insertPackageFromMessageSequelize(socket, newCollec, message);
      })
      .catch(function(err){
        console.log(err);
      });
    }
    else
    insertPackageFromMessageSequelize(socket, collec, message);
  })
  .catch(function(err){
    console.log(err);
  });
  insertLevel1++;

  /*
  var mac = message.data.macaddress;

  var collec = macMap[mac];

  if(!collec){
    if(!collec && !macMap[mac]){
      CollectorSeq.create({
        'mac': mac
      }).then(function(newCollec){
        console.log('criando...');
        macMap[mac] = newCollec.get({plain:true});
        insertPackageFromMessageSequelize(socket, newCollec, message);
      })
      .catch(function(err){
        console.log(err);
      });
    }
  }else{
    insertPackageFromMessageSequelize(socket, collec, message);
  }
  insertLevel1++;
  */
};

var insertRfiddataFromPackagePg = function(socket, pack, rfidArray){

  var rfidInsertCounter = rfidArray.length;
  var rfidInsertErrors = [];
  rfidArray.forEach(function(rfidElem){

    var obj = {};
    obj.rfidCode = rfidElem.identificationcode;
    obj.rfidReadDate = rfidElem.datetime;
    obj.serverReceivedDate = new Date();
    obj.packageId = pack.id;
    obj.extraData = 'nothing';

    var query = 'INSERT INTO "Rfiddata" ("rfidCode", "rfidReadDate", "serverReceivedDate", "packageId", "extraData", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ID';

    db.query(query, [obj.rfidCode, obj.rfidReadDate, obj.serverReceivedDate, obj.packageId, obj.extraData, new Date(), new Date()], function(err, result){
      rfidInsertCounter--;
      insertLevel4++;
      if(err){
        console.log("insertRFIDData error: " + err);
        rfidInsertErrors.push(err);
      }

      if(rfidInsertCounter == 0){
        finishedInsertingPackage(socket, rfidInsertErrors, pack.packageHash);
      }

    });
  });

  insertLevel3++;

}

var insertPackageFromMessagePg = function(socket, collec, message){
  var rfiddata = message.data.datasummary;

  var queryFind = 'SELECT * FROM "Packages" WHERE "packageHash" = $1';

  db.query(queryFind, [rfiddata.md5diggest], function(err, result){

    if(err){
      console.log("PackageDao findByHash error : " + err);
      return;
    }

    if(result.rows.length > 1){
      var msg = 'Unexpected Bahavior: More than one package found';
      throw new Error(msg);
      return;
    }

    if(result.rows.length < 1){
      //n achou
      var query = 'INSERT INTO "Packages" ("packageHash", "packageSize", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4) RETURNING ID';

      db.query(query, [rfiddata.md5diggest, rfiddata.data.length, new Date(), new Date()], function(err, result){
        if(err){
          console.log("PackageDao insert error : " + err);
          return;
        }
        insertRfiddataFromPackagePg(socket, {id : result.rows[0].id, packageHash : rfiddata.md5diggest }, rfiddata.data);
      });

    }else{
      console.log("Package já existe. Não será inserido");
      finishedInsertingPackage(socket, [], rfiddata.md5diggest);
    }
  });
  insertLevel2++;
}



var processReceivedDataPg = function(socket, message){
  var mac = message.data.macaddress;

  var query = 'SELECT * FROM "Collectors" WHERE mac = $1';
  db.query(query, [mac], function(err, result){
    if(err){
      console.log("CollectorDao findByMac error : " + err);
      return;
    }

    if(result.rowCount > 1){
      var msg = "Unexpected Bahavior: More than one collector found";
      throw new Error(msg);
      return;
    }

    if(!result.rows[0] && !macMap[mac]){
      macMap[mac] = mac;

      var query = 'INSERT INTO "Collectors" (mac, "createdAt", "updatedAt") VALUES ($1, $2, $3) RETURNING ID';
      db.query(query, [mac, new Date(), new Date()], function(err, result){
        if(err){
          console.log("collectorOkDao insert error : " + err);
          return;
        }
        insertPackageFromMessagePg(socket, result.rows[0], message);
      });

    }else {
      insertPackageFromMessagePg(socket, result.rows[0], message);
    }

  });

  insertLevel1++;
};

var processMessage = function(socket, message){

  switch(message.type){
    case "SYN":
    console.log(message.data.macaddress);
    sendObject(socket, buildMessageObject("ACK-SYN", message.data));
    break;
    case "ACK-ALIVE":
    console.log('ACK-ALIVE');
    break;
    case "DATA":
    // processReceivedDataMongoose(socket, message);
    processReceivedDataSequelize(socket,message);
    // processReceivedDataPg(socket,message);
    //aqui
    break;
    default:
    console.log('MESSAGE IGNORED: '+message.type);

  }
}

var ProtocolConnectionController = function(socket){
  if (false === (this instanceof ProtocolConnectionController)) {
    console.log('Warning: ProtocolConnectionController constructor called without "new" operator');
    return;
  }

  this.socket = socket;

  this.resetBuffer = function(){
    this.permanentDataBuffer = new Buffer(0);
    this.waitingForRemainingData = false;
    this.packetSize = 0;
  }

  this.resetBuffer();

  this.debug_receivedObjs = 0;
  this.debug_successJsonObjs = 0;
  this.debug_brokenJsonObjs = 0;
  this.debug_ignoredBuffer = 0;

  // setInterval((function(){
  //   console.log("processDataBuffer : debug_receivedObjs: " + this.debug_receivedObjs +
  //   " debug_successJsonObjs: " + this.debug_successJsonObjs +
  //   " debug_brokenJsonObjs: " + this.debug_brokenJsonObjs +
  //   " debug_ignoredBuffer: " + this.debug_ignoredBuffer
  //   );
  // }).bind(this),1000);

  this.consumeData = function(packet){
    this.debug_receivedObjs++;
    try {
      var message = {};
      message = JSON.parse(packet);
      processMessage(this.socket, message);

      this.debug_successJsonObjs++;
    }catch(e){
      console.log("consumeData error : " +e);
      this.debug_brokenJsonObjs++;
      return;
    }
  }

  this.processDataBuffer = function(){
    if(!this.waitingForRemainingData){
      // console.log("processDataBuffer : Probably a new pkt.");
      //new packet.
      if(! (this.permanentDataBuffer.length >= 8)){
        // console.log("processDataBuffer : We dont have at least 8 bytes. wait more.");
        return;
      }
      var buffer = [];
      buffer = this.permanentDataBuffer.slice(0, 8);
      this.permanentDataBuffer = this.permanentDataBuffer.slice(8, this.permanentDataBuffer.length);
      this.packetSize = parseInt(buffer);

      if(isNaN(this.packetSize)){
        this.debug_ignoredBuffer++;
        console.log("Package size isNAN. Ignoring/Reseting Buffer.");
        // Package error, incorrect size information. Clear buffer and start over
        this.resetBuffer();
        return;
      }

      // console.log("processDataBuffer : New pkt found with size : " + this.packetSize);
      this.waitingForRemainingData = true;
    }

    // console.log("processDataBuffer : this.permanentDataBuffer.length : " + this.permanentDataBuffer.length);

    if(this.permanentDataBuffer.length < this.packetSize){
      // console.log("processDataBuffer : We dont have all bytes to this packet. wait more.");
      return;
    }

    var data = this.permanentDataBuffer.slice(0, this.packetSize).toString();
    // console.log("data : " + data);
    this.permanentDataBuffer = this.permanentDataBuffer.slice(this.packetSize, this.permanentDataBuffer.length);
    // console.log("processDataBuffer : this.permanentDataBuffer.length : " + this.permanentDataBuffer.length);

    this.packetSize = 0;
    this.waitingForRemainingData = false;

    this.consumeData(data);
  }

  this.processData = function(data){

    // if(data){
    //   console.log("processData : NEW DATA RECEIVED: " + data.toString());
    //   this.permanentDataBuffer = Buffer.concat([this.permanentDataBuffer, data]);
    // }
    //
    // this.processDataBuffer();
    //
    // if(this.permanentDataBuffer.length > 8 && !this.waitingForRemainingData){
    //   // this.processData();
    //   process.nextTick(function(){this.processDataBuffer();}.bind(this));
    // }

    //----------------

    this.permanentDataBuffer = Buffer.concat([this.permanentDataBuffer, data]);

    do {
      this.processDataBuffer();
      // process.nextTick(this.processDataBuffer);
    }while(this.permanentDataBuffer.length > 8 && !this.waitingForRemainingData)
  }
}
