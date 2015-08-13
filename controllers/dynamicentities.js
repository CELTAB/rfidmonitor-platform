var SequelizeClass = require('sequelize');
var path = require('path');
var logger = require('winston');
//bug
var pg = require('pg');
delete pg.native;
//end - bug	
var PlatformError = require('../utils/platformerror');
var DEValidator = require('./devalidator');
var sequelize = require('../dao/platformsequelize');
var deModelPool = require('./demodelpool');


var DynamicEntities = function (){
	
	deValidator = new DEValidator(sequelize);
	SequelizeModel = require('../models/orm/sequelizemodel');
	
	// modelsORMPath = path.join(__dirname, '../models/orm');
	// ClientObjRaw = sequelize.import(path.join(modelsORMPath, '/clientobjraw'));

}


DynamicEntities.prototype.registerEntity = function(json, callback){

	//Checks each object integrity
	var errors = deValidator.validateClientRootArray(json, function(errors, newEntities){
		if(errors)
			return callback(errors);

		buildSequelizeModels(newEntities, callback);
	});
}

var buildDefinition = function(entity){
	var definition = { identifier : entity.identifier, model : {} };
	for (var i in entity.structureList){
		var field = entity.structureList[i];

		definition.model[field.identifier] = {
			type : deValidator.typesEnumToPostgres(field.type) ,
			allowNull : field.allowNull
		}
	}

	//error
	return definition;
}

var buildSequelizeModels = function(entities, callback){

	if(entities.length == 0)
		return callback({"message" : "Error : buildSequelizeModels : empty entities array"});

	for (var i in entities){
		var entity = entities[i];
		var definition = null;

		definition = buildDefinition(entity);
		if(!definition)
			return callback({"message" : "Error : cannot build definitions"});

		logger.warn(JSON.stringify(definition, null, '\t'));

		deModelPool.registerModel(definition, function(err){
			if(err)
				return callback(err)

			callback(null)
		});
	}
}

var isObject = function(a) {
    return (!!a) && (a.constructor === Object);
};

var isArray = function(a) {
    return (!!a) && (a.constructor === Array);
};

var isObjectEmpty = function(a){
	return Object.keys(a).length == 0;
}

module.exports = DynamicEntities;