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

// 'use strict';
var logger = require('winston');
var sequelize = require(__base + 'controller/database/platformsequelize');
var DynamicEntity = require(__base + 'models/dynamicentity');
var DEValidator = require(__base + 'controller/dynamic/devalidator');

var DEModelPool = function DEModelPool(){
  this.loadDynamicEntities = function(callback){
    DynamicEntity.findAll()
    .then(function(models){
        //Load all models from database and set it into the pool
        for(var i in models){
          var seqIdentifier = models[i].identifier;
          var seqModel = JSON.parse(models[i].sequelizeModel);

          seqModel = parseModelToReal(seqModel);
          var seqOptions = JSON.parse(models[i].sequelizeOptions);
          sequelize.define(
              seqIdentifier,
              seqModel,
              seqOptions
          );
          logger.debug("Dynamic model loaded into DEModelPool: " + models[i].identifier);
        }

        for (var it in models){
          var seqOptions = JSON.parse(models[it].sequelizeOptions);
          logger.silly(seqOptions);
          if(seqOptions.classMethods && seqOptions.classMethods.associate){
            var associate = seqOptions.classMethods.associate;
            if(associate.length > 0){
              for(var k in associate){
                try{
                  logger.silly(associate[k].modelName);
                  logger.silly(associate[k].targetName);
                  logger.silly(associate[k].foreignKey);
                  sequelize.model(associate[k].modelName).belongsTo(sequelize.model(associate[k].targetName), {foreignKey: associate[k].foreignKey});
                }catch(error){
                  return callback(error);
                }
              }
            }
          }
        }
        //todo maybe doind sync with sequelize instead of each model, it will try to order its creation in cases of dependecy
        sequelize.sync().then(function(){
          //Entities loaded.
          callback(null);
        }).catch(function(error){
          /* TASK #2043
    				The db user has readonly permissions, so the Sequelize will never succed on syncing.
    				In this case, the database must have been manually imported from a dump.
    				By that it is assumed the database structure is ready, and the permission error can be ignored.
    				The error occurs because the Sequelize wants to "CREATE TABLE IF NOT EXISTS" to guarantee the table exists while syncing. As the role has no permissions
    				for this kind of command, the db return the error code 42501.
    			*/
    			if(error.parent.code === "42501"){
    				logger.warn("Controlled error happening: Permission denied for current schema. POSTGRES code 42501. This must only happen in case of db user being readonly and the db had manually imported. The app is continuing.");
    				logger.debug("Controlled error happening: " + JSON.stringify(error));
    				return callback(null);
    			}
        });
    })
    .catch(function(e){
       logger.warn("ASSYNC DynamicEntity.findAll");
       logger.error(e);
       callback(e);
    });
  }

  if(DEModelPool.caller != DEModelPool.getInstance){
      throw new PlatformError("This object cannot be instanciated");
  }
}

DEModelPool.prototype.getModel = function(modelIdentifier){
  try{
    var model = sequelize.model(modelIdentifier);
    return model;
  }catch(e){
    return null;
  }
}

DEModelPool.prototype.registerModel = function(modelDefinitions, callback){
  var countTotal = modelDefinitions.length;
  var done = 0;
  var modelpoolTmp = [];

  for (var i in modelDefinitions){
    var modelDefinition = modelDefinitions[i];
    if(DEModelPool.prototype.getModel(modelDefinition.identifier)){
      //model already loaded.
      var error = {"message" : "model already loaded into pool. cannot register again or another entity with same identifier"};
      logger.error(error);
      return callback(error);
    }
    modelDefinition.sequelizeModel = parseModelToReal(modelDefinition.sequelizeModel);
    sequelize.define(
        modelDefinition.identifier,
        modelDefinition.sequelizeModel,
        modelDefinition.sequelizeOptions
    );
    modelpoolTmp.push(modelDefinition.identifier);
    done++;

    if(done == countTotal){
        for (var j in modelDefinitions){
          var modelDefinition = modelDefinitions[j];
          var associate = modelDefinition.sequelizeOptions.classMethods.associate;
          if(associate.length > 0){
            for(var k in associate){
              try{
                sequelize.model(associate[k].modelName).belongsTo(sequelize.model(associate[k].targetName), {foreignKey: associate[k].foreignKey});
              }catch(error){
                return callback(error);
              }
            }
          }
        }

      sequelize.sync().then(function(){
        for(var imdt in modelpoolTmp){
          logger.debug("Dynamic model registered into pool: " + modelpoolTmp[imdt]);
          var dbRoute = '/api/de/dao/' + modelpoolTmp[imdt];
        }
        //NO ERRORS
        return callback(null);
      }).catch(function(e){
        var error = "pool sequelize.sync error : " + e ;
        logger.error(error);
        return callback(error);
      });
    }
  }
}

var parseModelToReal = function(model){
   /*
   We store a string to define the type of the field on database.
   But for using on code running, we need to translate that for a Sequelize function that represents the type.
  */
  var attArray = Object.keys(model);
  for(var aedf in attArray){
    var attr = attArray[aedf];

    if(model[attr].type){
      model[attr].type = DEValidator.prototype.typesStrToRealTypes(model[attr].type);
    }
  }
  return model;
}

DEModelPool.instance = null;
DEModelPool.getInstance = function(){
  if(this.instance === null){
    this.instance = new DEModelPool();
  }
  return this.instance;
}

module.exports = DEModelPool.getInstance();
