var logger = require('winston');
var SequelizeModel = require('../models/orm/sequelizemodel');

var sequelize = require('../dao/platformsequelize');
var SequelizeClass = require('sequelize');

var DEModelPool = function DEModelPool(){

    var pool = {};

    SequelizeModel.findAll()
        .then(function(models){
            //Load all models from database and set it into the pool
            for(var i in models){
                pool[models[i].identifier] = sequelize.define(models[i].identifier, JSON.parse(models[i].model));            
                logger.debug("Dynamic model loaded into DEModelPool: " + models[i].identifier);
            }

        })
        .catch(function(e){
             logger.warn("ASSYNC SequelizeModel.findAll");
             logger.error(e);
        });

	this.getModel = function(modelIdentifier){
		return pool[modelIdentifier];
	}

    this.registerModel = function(modelDefinition, callback){
        // {identifier : "", model : {} }
        
        if(pool[modelDefinition.identifier]){
            //model already loaded.
            var error = {"message" : "model already loaded into pool. cannot register again or another entity with same identifier"};
            logger.error(error);
            return callback(error);
        }
        
        //TODO handle define errors
        var deModel = sequelize.define(modelDefinition.identifier, modelDefinition.model);

        SequelizeModel.create({identifier : modelDefinition.identifier, model : JSON.stringify(modelDefinition.model)})
        .then(function(m){
            pool[modelDefinition.identifier] = deModel;
            logger.debug("Dynamic model persisted into database: " + modelDefinition.identifier);
            //NO ERRORS
            return callback(null);
        })
        .catch(function(e){
            var error = {"message" : "Error trying to persisted Dynamic model into database: " + modelDefinition.identifier};
            logger.error(e);
            return callback(error);
        });        
       
    }
 
    if(DEModelPool.caller != DEModelPool.getInstance){
        throw new PlatformError("This object cannot be instanciated");
    }
}
 
DEModelPool.instance = null; 

DEModelPool.getInstance = function(){
    if(this.instance === null){
        this.instance = new DEModelPool();
    }
    return this.instance;
}
 
module.exports = DEModelPool.getInstance();