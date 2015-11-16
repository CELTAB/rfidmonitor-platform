'use strict';
var logger = require('winston');
var sequelize = require(__base + 'controller/database/platformsequelize');
var BaseController = require(__base + 'controller/basemodelctrl');
var errorHandler = require(__base + 'utils/errorhandler');

var CollectorCtrl = require(__base + 'controller/models/collector');
var Collector = sequelize.model('Collector');
var Package = sequelize.model('Package');

var RfidModel = sequelize.model('Rfiddata');
var Rfid = new BaseController(RfidModel, 'rfiddatas');

var changeFunc = function(body, callback){
  var errMessage = {error: "Not Allowed", code: 403, message: "You are not allowed to make any change on rfidDatas"};
	callback(errMessage);
};

Rfid.custom['remove'] = changeFunc;
Rfid.custom['save'] = changeFunc;
Rfid.defaultSave = Rfid.save;

var insertSummary = function(rfiddata, collector, callback){
  if(rfiddata.data.length === 0){
      logger.warn("Empty package received. send ACK-DATA");
      return callback(null, rfiddata.md5diggest);
  }

  try{
    Package.findOne({where:{packageHash:rfiddata.md5diggest}})
    .then(function(pk){
      if(pk)
        return callback(null, rfiddata.md5diggest);

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
          obj.collectorId = collector.id;
          obj.packageId = newPk.id;

          Rfid.defaultSave(obj, function(err, newRfid){
            if(err)
              return callback(err.error);

            callback();
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
    })
    .catch(function(e){
      logger.error('Error inserSummary: ' + e.toString());
      return callback(e);
    });
  }catch(e){
    logger.error('Error inserSummary: ' + e.toString());
    return callback(e);
  }
};

Rfid.save = function(rfiddata, callback){
  var cb = callback;
  callback = function(err, result){
    if(err){
      if(Rfid.custom.save)
        return cb(err);
      return cb({code: 500, error: err.toString(), message: 'RFIDDATA error'});
    }
    return cb(null, result);
  }

  var cole = {
    macaddress: rfiddata.macaddress,
    name: rfiddata.name
  };
  CollectorCtrl.findOrCreate(cole, function(err, collector){
    if(err){
      logger.error('Error: ' + err);
      return callback(err);
    }
    return insertSummary(rfiddata.datasummary , collector, callback);
  });
}

module.exports = Rfid;

/* RFIDDATA OBJ
{
  "datasummary": {
    "data": [
      {
        "applicationcode": 0,
        "datetime": "2014-10-15T15:58:33",
        "id": 1282,
        "idantena": 1,
        "idcollectorpoint": 100,
        "identificationcode": 44332211
      }
    ],
    "idbegin": -1273252204,
    "idend": -1273254596,
    "md5diggest": "f9b0941547b464689121e9e80266fde2"
  },
  "id": 100,
  "macaddress": "B8:27:EB:BB:0C:70",
  "name": "Celtab-Serial"
}
*/
