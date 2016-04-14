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
var Controller = require(__base + 'controller/basemodelctrl');
var errorHandler = require(__base + 'utils/errorhandler');
var collectorPool = require(__base + 'controller/collector/collectorpool');

var CollectorModel = sequelize.model('Collector');
var CollectorCtrl = new Controller(CollectorModel, 'collectors');
var Group = sequelize.model('Group');
var RFIDData = sequelize.model('Rfiddata');

var insertingMap = {};
CollectorCtrl.oldSave = CollectorCtrl.save;
CollectorCtrl.custom['find'] = function(id, query, callback){
  CollectorCtrl.find(id, query, function(err, result){
    if(err)
      return callback(err);

    var prepareDash = function(collector, callback) {
      RFIDData.findAll({
        where: {collectorId: collector.id},
        attributes: ['rfidCode', 'rfidReadDate'],
        order: [['rfidReadDate', 'DESC']]
      }).then(function(records){

        var response = {
          year: 0,
          month: 0,
          week: 0,
          daily: 0,
          lastYear: {}
        };

        var today = new Date();
        var start = new Date();
          start.setMonth(start.getMonth() - 12);
          start.setDate(start.getDate() - (start.getDate() - 1));
          start.setMonth(start.getMonth() + 1);
        while(start.getTime() <= today.getTime()){
          var key = (start.getMonth() + 1) + "-" + (start.getFullYear());
          response.lastYear[key] = 0;
          start.setMonth(start.getMonth() + 1);
        }
        var now = new Date();
        now.setFullYear(now.getFullYear() - 1);
        var year = records.filter(function(el){
            return now.getTime() <= new Date(el.rfidReadDate).getTime();
        });
        response.year = year.length;

        if(year.length > 0) {
          now = new Date();
          now.setMonth(now.getMonth() - 1);
          var month = year.filter(function(el){
              return now.getTime() <= new Date(el.rfidReadDate).getTime();
          });
          response.month = month.length;

          if(month.length > 0) {
            now = new Date();
            now.setDate(now.getDate() - 7);
            var week = month.filter(function(el){
                return now.getTime() <= new Date(el.rfidReadDate).getTime();
            });
            response.week = week.length;

            if(week.length > 0) {
              now = new Date();
              now.setDate(now.getDate() - 1);
              var daily = week.filter(function(el){
                  return now.getTime() <= new Date(el.rfidReadDate).getTime();
              });
              response.daily = daily.length;
            }
          }
          year.forEach(function(el) {
            var tmpDate = new Date(el.rfidReadDate);
            var key = (tmpDate.getMonth() + 1) + "-" + (tmpDate.getFullYear());
            var has = response.lastYear[key];
            if (has)
              response.lastYear[key] += 1;
            else
              response.lastYear[key] = 1;
          });
        }
        response.total = records.length;
        return callback(null, response);
      },
      function(err){
          return callback({err: err.toString(), code: 500, message: "Error on count RFIDData records"});
      });
    };

    var collectors = (result && result.rows) || result;
    var response = {};
    if(Array.isArray(collectors)){
      response = [];
      var collectorBack = 0;
      collectors.forEach(function(collector){
        var c = collector.get({plain: true});
        c.status = collectorPool.getStatusByMac(collector.mac);

        if(query && query.dashboard === true) {
          prepareDash(c, function(err, records) {
              if(err)
                return callback(err);
              c.records = records;
              response.push(c);
              collectorBack++;
              if(collectorBack === collectors.length) {
                result.rows = response;
                return callback(null, result);
              }
          });
        }else{
          response.push(c);
        }
      }, this);

      if(!query || query.dashboard !== true) {
        result.rows = response;
        return callback(null, result);
      }

    }else{
      if(collectors){
        response = collectors.get({plain: true});
        response.status = collectorPool.getStatusByMac(collectors.mac);
        //Always return dashboard information for ID search
        prepareDash(response, function(err, records) {
            if(err)
              return callback(err);
            response.records = records;
            return callback(null, response);
        });
      }else{
        //If no collector is found, return with error code and messages
        response = {error: 'Error on Collectors', code: 404, message: 'ID not found'};
        return callback(response);
      }
    }
  });
};

CollectorCtrl.promiseSave = function(newCollector, callback){
    var promise = insertingMap[newCollector.mac];
    if(promise){
      return callback(promise);
    }

    var deferred = q.defer();
    insertingMap[newCollector.mac] = deferred.promise;
    callback(deferred.promise);
    var afterSave = function(err, collector){
      if(err){
        deferred.reject(err);
      }else{
        logger.debug("Collector inserted. new ID: " + collector.id);
        var c = collector.get({plain: true});
        collectorPool.push(c);
        delete insertingMap[collector.mac];
        deferred.resolve(c);
      }
    }

    if(newCollector.groupId){
      CollectorCtrl.oldSave(newCollector, afterSave);
    }else{
      Group.findOne({where: {isDefault: true, deletedAt: null}})
      .then(function(group){
        if(group){
          newCollector.groupId = group.id;
          return CollectorCtrl.oldSave(newCollector, afterSave);
        }else{
          throw new Error('Default Group not found when it should be');
        }
      })
      .catch(function(e){
        logger.error(e);
        return afterSave(e);
      });
    }
};

CollectorCtrl.findOrCreate = function(collector, callback){
  // Using scope defined by the model
  CollectorModel.scope({ method: ['byMac', collector.macaddress]}).find()
  .then(function(collectorResult) {
    if (collectorResult) {
      return callback(collectorResult.get({plain: true}));
    } else {
      collector.name = (!!collector.name)? collector.name : 'Unknown';
      collector.mac = collector.macaddress;
      if(collector.id)
        delete collector.id;
      delete collector.macaddress;
      return CollectorCtrl.promiseSave(collector, callback);
    }
  })
  .catch(function(err) {
    return callback({err: err.toString(), code: 500, message: 'Error on find Collector'});
  });
};

module.exports = CollectorCtrl;
