'use strict';
var logger = require('winston');
var sequelize = require(__base + 'controller/database/platformsequelize');
var Controller = require(__base + 'controller/basemodelctrl');
var errorHandler = require(__base + 'utils/errorhandler');
var collectorPool = require(__base + 'controller/collector/collectorpool');

var CollectorModel = sequelize.model('Collector');
var CollectorCtrl = new Controller(CollectorModel, 'collectors');
var Group = sequelize.model('Group');
//Any custom functions goes here

CollectorCtrl.custom['save'] = CollectorCtrl.save;
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
      response = collectors.get({plain: true});
      response.status = collectorPool.getStatusByMac(collectors.mac);
    }
    return callback(null, response);
  });
};

CollectorCtrl.save = function(newCollector, callback){
  try{
    if(newCollector.group_id){
      return CollectorCtrl.custom.save(newCollector, function(err, collector){
          if(err){
            return callback(err);
          }

          var c = collector.get({plain: true});
          collectorPool.push(c);
          return callback(null, c);
      });
    }else{
      Group.find({where: {isDefault: true, deletedAt: null}})
      .then(function(group){
        if(group){
          newCollector.group_id = group.id;
          return CollectorCtrl.custom.save(newCollector, callback);
        }else{
          var defaultGroup = {isDefault: true, name: "Default Group", description: "Auto-generated default group"};
          Group.create(defaultGroup)
          .then(function(nGroup){
            newCollector.group_id = nGroup.id;
            return CollectorCtrl.custom.save(newCollector, callback);
          });
        }
      });
    }
  }catch(e){
    return callback('Error on save collector: ' + e.toString());
  }
};

CollectorCtrl.findOrCreate = function(collector, callback){

  CollectorCtrl.find(bull, {where: {mac:collector.macaddress, deletedAt: null}},
    function(err, collector){
      if(err)
        return callback(err);

      if(!collector){
        collector.name = (!!collector.name)? collector.name : 'Unknown';
        collector.mac = collector.macaddress;

        if(collector.id)
          delete collector.id;
        delete collector.macaddress;

        CollectorCtrl.custom.save(collector, function(err, collector){
          if(err){
            return callback(err);
          }

          var c = collector.get({plain: true});
          collectorPool.push(c);
          return callback(null, c);
        });
      }else{
        return callback(null, collector.get({plain: true}));
      }
    });
};

module.exports = CollectorCtrl;
