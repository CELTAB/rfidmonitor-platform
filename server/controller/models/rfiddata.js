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
var q = require('q');
var sequelize = require(__base + 'controller/database/platformsequelize');
var BaseController = require(__base + 'controller/basemodelctrl');
var errorHandler = require(__base + 'utils/errorhandler');

var DEValidator = require(__base + 'controller/dynamic/devalidator');
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

var getDynamicEntity = function(identifier, callback){
  var dynamic = sequelize.model('DynamicEntity');
  dynamic.findOne({where: {identifier: identifier}})
  .then(function(entityDef){
    if(!entityDef){
      return callback({error: 'The given identifier does not match to any dynamic entity', code: 404, message:'Dynamic Entity Not found'});
    }

    var structure = JSON.parse(entityDef.meta).structureList;
    var entityField = structure.filter(function(element){
      return element.type === DEValidator.prototype.typesEnum.RFIDCODE;
    })
    .map(function(el){ return el.identifier})[0];
    if(!entityField){
      return callback({error: 'The Dynamic Entity must have one RFIDCODE Field', code: 404, message:'RFIDCODE Field Not found'});
    }

    return callback(null, entityField);
  })
  .catch(function(e){
      return callback({error: e.toString(), code: 500, message:"Error on find DynamicEntity"});
  });
};

var getEntities = function(query, codesRelated){
  var deferred = q.defer();

  getDynamicEntity(query.entity, function(err, entityField){
    if(err){
      deferred.reject(err);
      return;
    }

    var entityQuery = query.entityQuery || {};
    if(!entityQuery.where)
     entityQuery.where = {};
    entityQuery.where[entityField] = {$in: codesRelated};
    try{
      var model = sequelize.model(query.entity);
      model.findAll(entityQuery)
      .then(function(result){
        var responseObj = {};
        result.forEach(function(element){
          responseObj[element[entityField]] = element;
        });
        deferred.resolve(responseObj);
      })
      .catch(function(e){
        var errMessage = {error: e.toString(), code: 500, message:"Error on find Entities"};
        deferred.reject(errMessage);
      });
    }catch(e){
      var errMessage = {error: e.toString(), code: 500, message:"Error on load DynamicEntity"};
      deferred.reject(errMessage);
    }
  });
  return deferred.promise;
};

var embeddedRecords = function(query, callback){
  getDynamicEntity(query.entity, function(err, entityField){
    if(err)
      return callback(err);

    var entityQuery = query.entityQuery || {};
    if(!entityQuery.where)
     entityQuery.where = {};
    var inQuery = undefined;
    if(query.where && query.where.rfidCode){
      var rfidquery = query.where.rfidCode;
      if(typeof rfidquery === 'object'){
        inQuery = rfidquery;
      }else{
        inQuery = {$in: [rfidquery]}
      }
    }
    if(inQuery)
      entityQuery.where[entityField] = inQuery;

    var model = sequelize.model(query.entity);
    model.findAll(entityQuery)
    .then(function(ety){
      var size = 0;
      var response = [];
       ety.forEach(function(el){
         query.where = query.where || {};
         query.where.rfidCode = query.where.rfidCode || el[entityField];
         if(query.where.rfidCode !== el[entityField])
          query.where.rfidCode = el[entityField];

          query.order = query.order || [['rfidReadDate', 'DESC']];

          Rfid.find(null, query, function(err, records){
            if(err)
              return callback(err);

            var res = el.get({plain: true});
            res.records = records;
            response.push(res);
            // return callback(null, res);
            size++;
            if(size === ety.length)
              return callback(null, response);
          });
       });
    })
    .catch(function(e){
      return callback({error: e.toString(), code: 500, message:"Error 0"});
    });
  });
};

var embeddedEntity = function(query, callback){
  Rfid.find(null, query, function(err, records){
    if(err)
    return callback(err);

    if(records.length > 0 && query && query.entity){
      var tmpObj = {};
      var codesRelated = records.filter(function(current){
        if(tmpObj[current.rfidCode])
          return false;

        tmpObj[current.rfidCode] = current;
        return true;
      })
      .map(function(current){return current.rfidCode});

      getEntities(query, codesRelated)
      .then(function(data){

        var responseObj = [];
        records.forEach(function(record){
          var entity = data[record.rfidCode];
          if(entity){
            var tmp = record.get({plain:true});
            tmp.entity = entity;
            delete tmp.Package;
            responseObj.push(tmp);
          }
        });
        return callback(null, responseObj);
      },
      function(err){
        return callback(err);
      });

    }else{
      return callback(null, records);
    }
  });
};

Rfid.custom['find'] = function(id, query, callback){
  // select * from tb_plat_rfiddata as rfid, tb_de_carro as carro where rfid."rfidCode" = carro.pit;
  // return Rfid.find(id, query, callback); //Just go ahead
  if(id){
    return Rfid.find(id, query, callback);
  }else if(query && query.embeddedRecords === true){
    if(query.entity)
      return embeddedRecords(query, callback);
    else
      return callback({error: "To query with embeddedRecords been true, the 'entity' parameter is mandatory", code: 400, message: "Missing entity parameter"});
  }else{
    return embeddedEntity(query, callback);
  }
};

var insertSummary = function(rfiddata, collector, callback){
  if(rfiddata.data.length === 0){
    logger.warn("Empty package received. send ACK-DATA");
    return callback(null, rfiddata.md5diggest);
  }

  try{
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
      })
      .catch(function(e){
        if(e.name === "SequelizeUniqueConstraintError" && e.fields['packageHash']){
          logger.debug("Package already on database");
          return callback(null, rfiddata.md5diggest);
        }
        logger.error('Error inserSummary package: ' + e.toString());
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
      return cb({code: 500, error: err, message: 'RFIDDATA error'});
    }
    return cb(null, result);
  }

  var cole = {
    macaddress: rfiddata.macaddress,
    name: rfiddata.name
  };
  CollectorCtrl.findOrCreate(cole, function(collector){
    if(collector.then){
      collector.then(function(c){
        return insertSummary(rfiddata.datasummary, c, callback);
      },
      function(e){
        logger.error('Error: ' + err);
        return callback(err);
      });
    }else{
      return insertSummary(rfiddata.datasummary, collector, callback);
    }
  });
}

Rfid.bulkSave = function(array, callback){
  var total = array.length;
  logger.debug('array total length: ' + total)

    if(total === 0){
      return errorHandler('The data array is empty.', 400, callback);
    }

    var count = 0;
    var globalError = [];
    var repeatedRfiddata = 0;
    var newRfiddata = 0;
    var errorRfiddata = 0;

    array.forEach(function(data) {

      Rfid.save(data, function(err, result) {
        count ++;
        if(err){
            globalError.push({error : err });
            errorRfiddata++;
        }else{
          newRfiddata++;
        }
        if(count === total){
          var returnGlobalError = null;
          if(globalError.length > 0) {
            returnGlobalError = {};
            for (var i = 0; i < globalError.length; i++)
              if (globalError[i] !== undefined) returnGlobalError[i] = globalError[i];
          }
          // var returnGlobalError = globalError.length > 0? globalError : null;
          return callback(returnGlobalError, { 'received' : total, 'inserted' : newRfiddata, 'discardedByRepetition': repeatedRfiddata, 'discardedByError' : errorRfiddata});
        }

      });

    });
}

//Extra rout for count RFIDData Records
var Route = require(__base + 'utils/customroute');
var countHandler = function(req, callback){
  var query = req.query.q? JSON.parse(req.query.q) : undefined;
  RfidModel.findAndCountAll(query).then(function(result){
    return callback(null, {total: result.count});
  });
}
Rfid.customRoute = [new Route('get', '/count/rfiddatas', countHandler)];

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
