var logger = require('winston');
var SequelizeClass = require('sequelize');
var sequelize = require('../dao/platformsequelize');

var DynamicEntity = require('../models/orm/dynamicentity');
var PlatformMedia = require('../models/orm/platformmedia'); // here just for early sync
var DEValidator = require('./devalidator');


var DEModelPool = function DEModelPool(){

    PlatformMedia.sync().catch(function(e){
        logger.error("DeRouter sync error : " +e );
    });

    var pool = {};

    DynamicEntity.sync().then(function(){
        logger.warn('redundant with dynamicentities');
        DynamicEntity.findAll()
        .then(function(models){
            //Load all models from database and set it into the pool
            for(var i in models){

                var seqIdentifier = models[i].identifier;
                var seqModel = JSON.parse(models[i].sequelizeModel);
                seqModel = parseModelToReal(seqModel);
                var seqOptions = JSON.parse(models[i].sequelizeOptions);

                pool[models[i].identifier] = sequelize.define(
                    seqIdentifier,
                    seqModel,
                    seqOptions                    
                ); 

                // pool[models[i].identifier].sync();

                logger.debug("Dynamic model loaded into DEModelPool: " + models[i].identifier);
            }
            //todo maybe doind sync with sequelize instead of each model, it will try to order its creation in cases of dependecy
            sequelize.sync();

        })
        .catch(function(e){
             logger.warn("ASSYNC DynamicEntity.findAll");
             logger.error(e);
        });        
    }).catch(function(e){
         logger.error("Error while syncing DynamicEntity on pool" + e);
    });


	this.getModel = function(modelIdentifier){
		return pool[modelIdentifier];
	}

    this.registerModel = function(modelDefinitions, callback){
        
        var countTotal = modelDefinitions.length;
        var done = 0;
        var modelpoolTmp = [];

        // for (var abc in modelDefinitions){
        //         logger.warn(JSON.stringify(modelDefinitions[abc]));
        //     }

        for (var i in modelDefinitions){
            
            var modelDefinition = modelDefinitions[i];

            if(pool[modelDefinition.identifier]){
                //model already loaded.
                var error = {"message" : "model already loaded into pool. cannot register again or another entity with same identifier"};
                logger.error(error);
                return callback(error);
            }

            modelDefinition.sequelizeModel = parseModelToReal(modelDefinition.sequelizeModel);
           

            var deModel = sequelize.define(
                modelDefinition.identifier, 
                modelDefinition.sequelizeModel,
                modelDefinition.sequelizeOptions
                );

            modelpoolTmp.push({identifier: modelDefinition.identifier, model: deModel});            
            
            done++;

            if(done == countTotal){
                sequelize.sync().then(function(){
                    for(var imdt in modelpoolTmp){
                        logger.debug("Dynamic model registered into pool: " + modelpoolTmp[imdt].identifier);
                        pool[modelpoolTmp[imdt].identifier] = modelpoolTmp[imdt].model;
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
 
    if(DEModelPool.caller != DEModelPool.getInstance){
        throw new PlatformError("This object cannot be instanciated");
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