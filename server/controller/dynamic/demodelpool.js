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

/**
* Class that manages the dynamic entities, registering and loading the models.
* DEModelPool refers to DynamicEntitiesModelPool
* @class
*/
var DEModelPool = function DEModelPool(){

    /**
     * Load from database the sequelize models that defines the dynamic entities.
     * @param  {Function} callback callback when done, that passes an error as parameter.
     * @return {void}
     */
    this.loadDynamicEntities = function(callback){

        DynamicEntity.findAll()
        .then(function(models){
            //Load all models from database and set it into the pool
            for(var i in models){
                var seqIdentifier = models[i].identifier;

                //The sequelizeModel is a json in string format. Must be parsed to JSON.
                var seqModel = JSON.parse(models[i].sequelizeModel);

                /*
                The persisted JSON has string values that represent complex objects from Sequelize.
                As it is not possible to persist those, we need to re-convert the strings keys to real sequelize complex objects.

                For example:
                The sequelize defines the type of a model's field as Sequelize.TEXT. This is a complex object that contains, among
                other variables, some functions.
                We cannot convert functions to be in a JSON.
                Because of that, we create a string reference for that type, as 'Sequelize.TEXT' (a string).
                Then, the string is put inside the JSON that defines a Sequelize model, and it is persisted to the database.
                When one gets the model from the database, he must parse the string 'Sequelize.TEXT' to an Sequelize valid type object as Sequelize.TEXT.

                 */
                seqModel = parseModelToReal(seqModel);
                var seqOptions = JSON.parse(models[i].sequelizeOptions);
                sequelize.define(
                    seqIdentifier,
                    seqModel,
                    seqOptions
                );
                logger.debug("Dynamic model loaded into DEModelPool: " + models[i].identifier);
            }

            // After loading the model, it is necessary to check if there are association between them.
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
            //Synchonized the loaded entities definitions to the database.
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

/**
 * Get a model by its identifier
 * @param  {String} modelIdentifier is the dynamic entity identifier
 * @return {Object} is the Sequelize Model.
 */
DEModelPool.prototype.getModel = function(modelIdentifier){
    try{
        var model = sequelize.model(modelIdentifier);
        return model;
    }catch(e){
        return null;
    }
}

/**
 * Receives an array of sequelize models, for new entities and register it in the database and the needed routes.
 * @param  {Array}   modelDefinitions are the Sequelize model definitions.
 * @param  {Function} callback         callback for when done, that receives an error as parameter.
 * @return {void}
 */
DEModelPool.prototype.registerModel = function(modelDefinitions, callback){
    var countTotal = modelDefinitions.length;
    var done = 0;
    var modelpoolTmp = [];

    //Loop through the models
    for (var i in modelDefinitions){
        var modelDefinition = modelDefinitions[i];

        //Check if the identifier is already present in the DEModelPools (that contains valid models actually in production)
        if(DEModelPool.prototype.getModel(modelDefinition.identifier)){
            //model already loaded.
            var error = {"message" : "model already loaded into pool. cannot register again or another entity with same identifier"};
            logger.error(error);
            return callback(error);
        }

        //Convert models from string to real Sequelize Models
        modelDefinition.sequelizeModel = parseModelToReal(modelDefinition.sequelizeModel);

        //Load the model.
        sequelize.define(
            modelDefinition.identifier,
            modelDefinition.sequelizeModel,
            modelDefinition.sequelizeOptions
        );

        //Add to a temporary pool.
        modelpoolTmp.push(modelDefinition.identifier);

        //Controls the number of processed models, due asynchronicity
        done++;

        //When the number of processed models reaches the total, means every model have been processed.
        if(done == countTotal){

            //Now that every model is loaded, it is possible to stablish the association between them.
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

            //Synchronize the models to the database.
            sequelize.sync().then(function(){
                for(var imdt in modelpoolTmp){
                    logger.debug("Dynamic model registered into pool: " + modelpoolTmp[imdt]);

                    //Defines a new route for every new model (entity)
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

/**
 * Converts string references of sequelize types to complex Sequelize type objects
 * @param  {Object} model is the model to be parsed
 * @return {Object}       is the new model with complex Sequelize Objects.
 * @memberof DEModelPool
 */
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

/**
 * Holds the only instance of the  DEModelPool class. Singleton.
 * @type {DEModelPool}
 */
DEModelPool.instance = null;

/**
 * Gets the only instance of the DEModelPool class.
 * @return {DEModelPool} is the only instance of the DEModelPool class.
 */
DEModelPool.getInstance = function(){
    if(this.instance === null){
        this.instance = new DEModelPool();
    }
    return this.instance;
}

module.exports = DEModelPool.getInstance();
