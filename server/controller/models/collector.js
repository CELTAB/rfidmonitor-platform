'use strict';
var logger = require('winston');
var sequelize = require(__base + 'controller/database/platformsequelize');
var Controller = require(__base + 'controller/basemodelctrl');
var errorHandler = require(__base + 'utils/errorhandler');
var collectorPool = require(__base + 'controller/collector/collectorpool');

var CollectorModel = sequelize.model('Collector');
var CollectorCtrl = new Controller(CollectorModel, 'collectors');
var Group = sequelize.model('Group');

CollectorCtrl.oldSave = CollectorCtrl.save;
CollectorCtrl.custom['find'] = function(id, query, callback){
  CollectorCtrl.find(id, query, function(err, collectors){
    if(err)
      return callback(err);

    var response = {};
    if(Array.isArray(collectors)){
      response = [];
      collectors.forEach(function(collector){
        var c = collector.get({plain: true});
        c.status = collectorPool.getStatusByMac(collector.mac);
        response.push(c);
      });
    }else{
      if(collectors){
        response = collectors.get({plain: true});
        response.status = collectorPool.getStatusByMac(collectors.mac);
      }
    }
    return callback(null, response);
  });
};

CollectorCtrl.save = function(newCollector, callback){
  try{
    var afterSave = function(err, collector){
      if(err){
        return callback(err);
      }
      logger.debug("Collector inserted. new ID: " + collector.id);
      var c = collector.get({plain: true});
      collectorPool.push(c);
      return callback(null, c);
    }

    if(newCollector.groupId){
      return CollectorCtrl.oldSave(newCollector, afterSave);
    }else{
      Group.find({where: {isDefault: true, deletedAt: null}})
      .then(function(group){
        if(group){
          newCollector.groupId = group.id;
          return CollectorCtrl.oldSave(newCollector, afterSave);
        }else{
          var defaultGroup = {isDefault: true, name: "Default Group", description: "Auto-generated default group"};
          Group.create(defaultGroup)
          .then(function(nGroup){
            newCollector.groupId = nGroup.id;
            return CollectorCtrl.oldSave(newCollector, afterSave);
          });
        }
      });
    }
  }catch(e){
    return errorHandler('Error on save collector: ' + e.toString(), 500, callback);
  }
};

CollectorCtrl.findOrCreate = function(collector, callback){
  CollectorCtrl.find(null, {where: {mac:collector.macaddress, deletedAt: null}},
    function(err, collectorResult){
      if(err)
        return callback(err);

      if(collectorResult.length === 0){
        collector.name = (!!collector.name)? collector.name : 'Unknown';
        collector.mac = collector.macaddress;
        if(collector.id)
          delete collector.id;
        delete collector.macaddress;
        return CollectorCtrl.save(collector, callback);
      }else{
        return callback(null, collectorResult[0].get({plain: true}));
      }
    });
};

module.exports = CollectorCtrl;
