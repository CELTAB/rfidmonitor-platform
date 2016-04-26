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
var sequelize = require(__base + 'controller/database/platformsequelize');
var DynamicEntity = sequelize.model('DynamicEntity');
var deModelPool = require(__base + 'controller/dynamic/demodelpool');
var errorHandler = require(__base + 'utils/errorhandler');

var handlers = function() {

  //Retrieve one dynamic entity from database
  var getEntity = function(req, callback) {
    if(!deModelPool.getModel(req.params.entity))
      return errorHandler('Invalid Entity.', 400, callback);

    DynamicEntity.findOne({
      where: { identifier: req.params.entity}
    })
    .then(function(entity){
      if(!entity)
        return errorHandler('Invalid Entity.', 400, callback);

      return callback(null, entity);
    })
    .catch(function(e){
      return errorHandler(500, e.toString(), callback);
    });
  };

  var getAllEntities = function(query, callback) {
    DynamicEntity.findAll(query)
    .then(function(entities){
      return callback(null, entities);
    })
    .catch(function(e){
      return errorHandler(e.toString(), 500, callback);
    });
  };

  //Update the entity to activate or deactivate it
  var updateEntity = function(req, value, callback) {
    getEntity(req, function(err, entity) {
      if(err) return callback(err);

      entity.active = value;
      entity.save().then(function(ok){
        return callback(null, {"message" : "OK"});
      });
    });
  };

  //GET method for the dynamic entities
  var metaHandler = function(req, callback) {
    var query = null;
    if (req.query && req.query.q) {
      try {
        query = JSON.parse(req.query.q);
      }catch(e) {
        return errorHandler('Invalid query', 400, callback);
      }
    }
    var getOriginal = query && query.original === true;

    if (req.params.entity) {
      getEntity(req, function(err, entity) {
        if(err) return callback(err);

        if (getOriginal) {
          var response = JSON.parse(entity.original);
          response.active = entity.active;
          return callback(null, response);
        }
        return callback(null, JSON.parse(entity.meta));
      });
    } else {
      var qr = getOriginal ?
          {attributes : ['original', 'active']} :
          {attributes : ['meta'], where: {active: true}};

      getAllEntities(qr, function(err, entities) {
        if (err) return callback(err);

        var response = [];
        if (getOriginal) {
          for(var i in entities){
            var enti = entities[i].original;
            enti = JSON.parse(enti);
            enti.active = entities[i].active;
            response.push(enti);
          }
        } else {
          for(var i in entities){
            response.push(JSON.parse(entities[i].meta));
          }
        }
        return callback(null, response);
      });
    }
  };

  //POST method to crate a new dynamic entity
  var registerHandler = function(req, callback) {
    var dynamicEntities = new (require(__base + 'controller/dynamic/dynamicentities'))();
    dynamicEntities.registerEntity(req.body, function(errors){
      if(errors)
        return callback({code: 500, error: errors, message: 'Error on save dynamic entity'});
      return callback(null, {"message" : "OK"});
    });
  };

  //PUT method that allows activate an deactivated (deleted) entity
  var activeHandler = function(req, callback){
    return updateEntity(req, true, callback);
  };

  //DELETE method that actually deactivate a dynamic entity
  var deactivateHandler = function(req, callback) {
    return updateEntity(req, false, callback);
  };

  return {
    activate: activeHandler,
    deactivate: deactivateHandler,
    meta: metaHandler,
    register: registerHandler
  };
};

module.exports = handlers();
