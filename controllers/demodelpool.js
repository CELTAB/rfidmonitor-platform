var logger = require('winston');
var sequelize = require('../dao/platformsequelize');

var DynamicEntity = require('../models/orm/dynamicentity');
var DEValidator = require('./devalidator');
var routes = require('../utils/routes');


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
            //todo maybe doind sync with sequelize instead of each model, it will try to order its creation in cases of dependecy
            sequelize.sync().then(function(){
                
                //Entities loaded.
                callback(null);
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
        logger.error(e);
        return null;
    }
}

DEModelPool.prototype.registerModel = function(modelDefinitions, callback){
        
    var countTotal = modelDefinitions.length;
    var done = 0;
    var modelpoolTmp = [];

    for (var i in modelDefinitions){
        
        var modelDefinition = modelDefinitions[i];

        if(
            DEModelPool.prototype.getModel(modelDefinition.identifier)
            ){
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
            sequelize.sync().then(function(){
                for(var imdt in modelpoolTmp){
                    logger.debug("Dynamic model registered into pool: " + modelpoolTmp[imdt]);
                    
                    var dbRoute = '/api/de/dao/' + modelpoolTmp[imdt];
                    routes.register(dbRoute, routes.getMethods().GET);
                    routes.register(dbRoute, routes.getMethods().POST);
                    routes.register(dbRoute, routes.getMethods().PUT);
                    routes.register(dbRoute, routes.getMethods().DELETE);
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
     /*We store a string to define the type of the field on database.
        but for using on code running, we need to translate that for a Sequelize function that represents the type.
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