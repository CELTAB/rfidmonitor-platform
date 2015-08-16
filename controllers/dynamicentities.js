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
var DynamicEntity = require('../models/orm/dynamicentity');


/*
	- check warns on the code to fix.
	- find for todo to fix.

	List :
	 - after persisting some definition on table, if anything fails after that and couldt complet
	 the task, the definition already persist is not being deleted.
	 - tables are created faster than other, and when they are associated, sometimes will break the 
	 creation, because a table need another that is not created yet, will will be very soon. It is needed to 
	 order the table creation and make it sincronous.

*/


var DynamicEntities = function (){
	
	

	deValidator = new DEValidator(sequelize);
}

var rollbackEntities = function(entities){

	if(entities)
		logger.debug('rollBackEntities on :' + entities);
	else
		logger.debug('rollbackEntities triggered but not necessary. Not a problem.')

	for (var i in entities){
		var entity = entities[i];

		logger.debug('rollbacking :' + entity);

		DynamicEntity.findOne({where : {identifier : entity.identifier}})
		.then(function(rec){

			rec.destroy().then(function(rec){

				logger.debug('rollback done.');

			})
			.catch(function(e){
				logger.error('Error while trying to rollback entities on DynamicEntities on destroy : ' + e );
			});

		})
		.catch(function(e){
			logger.error('Error while trying to rollback entities on DynamicEntities on findOne : ' + e );
		});
	}


}


DynamicEntities.prototype.registerEntity = function(json, callback){
	//Checks each object integrity
	var errors = deValidator.validateClientRootArray(json, function(errors, newEntities){
		if(errors){
			rollbackEntities(newEntities);
			return callback(errors);
		}


		buildSequelizeModels(newEntities, function(errors){
			if(errors){
				logger.error('errors ' + errors);
				rollbackEntities(newEntities);
			}

			callback(errors); //errors can be null or something.

		});
	});
}

var buildDefinition = function(entity){

	var definition = {};

	definition.identifier = entity.identifier;

	definition.sequelizeModel = {} ;
	
	definition.sequelizeOptions = {
		paranoid : true,
		freezeTableName: true,
  		tableName: 'tb_de_' + entity.identifier
	}

	/*
	 // Creating two objects with the same value will throw an error. The unique property can be either a
	 // boolean, or a string. If you provide the same string for multiple columns, they will form a
	 // composite unique key.
	 someUnique: {type: Sequelize.STRING, unique: true},
	 uniqueOne: { type: Sequelize.STRING,  unique: 'compositeIndex'},
	 uniqueTwo: { type: Sequelize.INTEGER, unique: 'compositeIndex'}
	*/

	var uniqueMap = {};

	// Example : unique : [ ['abc', 'cde'] , ['def'] ]
	for (var iu in entity.unique){
		var uqConstraint = entity.unique[iu];
		logger.debug(JSON.stringify(uqConstraint));

		if(uqConstraint.length == 1){
			// unique : ['def']   > single field unique
			uniqueMap[uqConstraint[0]] = true;
			/*
				uniqueMap : {
					def : true
				}
			*/		
		}else{
			var constraintName = 'uq_'+definition.sequelizeOptions.tableName;
			for (var iun in uqConstraint){
				constraintName += '_' + uqConstraint[iun];
				/*
				loop 1 : uq_de_myGenericTable_abc

				loop 2 : uq_de_myGenericTable_abc_cde
				*/
			}

			for (var iun in uqConstraint){
				uniqueMap[uqConstraint[iun]] = constraintName;

				/*
				loop 1 : 
					uniqueMap : {
						def : true,
						abc : 'uq_de_myGenericTable_abc_cde'
					}

				loop 2 : 
					uniqueMap : {
						def : true,
						abc : 'uq_de_myGenericTable_abc_cde',
						cde : 'uq_de_myGenericTable_abc_cde'
					}
				*/
			}
		}
	}

	logger.debug(JSON.stringify(uniqueMap));


	for (var i in entity.structureList){
		var field = entity.structureList[i];

		if(field.type == DEValidator.prototype.typesEnum.ENTITY){

			var fieldName = field.identifier + '_id';
			field.identifierUpdated = fieldName;

			definition.sequelizeModel[fieldName] = {
				type: 'Sequelize.INTEGER',
				references: {
					model: 'tb_de_' + field.identifier, // Can be both a string representing the table name, or a reference to the model
					key:   "id"
					//, deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
				}
			}

		}else if(field.type == DEValidator.prototype.typesEnum.GROUP){

			var fieldName = field.identifier + '_group_id';
			field.identifierUpdated = fieldName;

			logger.warn('fix group table name to tb_plat_group  someday...');

			definition.sequelizeModel[fieldName] = {
				type: 'Sequelize.INTEGER',
				references: {
					model: 'group', // Can be both a string representing the table name, or a reference to the model
					key:   "id"
					//, deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
				}
			}

		}else if(field.type == DEValidator.prototype.typesEnum.IMAGE){

			var fieldName = field.identifier + '_platform_media';
			field.identifierUpdated = fieldName;

			definition.sequelizeModel[fieldName] = {
				type: 'Sequelize.INTEGER',
				allowNull : true,
				references: {
					model: 'tb_plat_platform_media', // Can be both a string representing the table name, or a reference to the model
					key:   "id"
					//, deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
				}
			}

		}else{
			try{
				var fieldName = field.identifier;
				field.identifierUpdated = fieldName;

				definition.sequelizeModel[fieldName] = {
					type : deValidator.typesEnumToSequelize(field.type) ,
					allowNull : field.allowNull			
				}
			}catch(e){
				logger.error("buildDefinition error on deValidator.typesEnumToSequelize: " + e);
				//null means problem
				return null;
			}
			
		}

		//Sets unique on the field if in the map
		if(uniqueMap[field.identifier])
			definition.sequelizeModel[field.identifierUpdated].unique = uniqueMap[field.identifier];
	}

	return definition;
}

var registerModelsWhenReady = function(definitions, callback){
	deModelPool.registerModel(definitions, function(err){
		if(err){
			var error = 'error while registering model on dynamiceentities : ' + err;
			logger.error(error);

			return callback(err)
		}


		return callback(null); //sucess

	});
}

var buildSequelizeModels = function(entities, callback){

	if(entities.length == 0)
		return callback({"message" : "Error : buildSequelizeModels : empty entities array"});

	var definitions = [];

	var loopError = null;
	var loopTotal = entities.length;
	var loopCount = 0;

	var definitionsMapperTmp = {};


	for (var i in entities){

		var entity = entities[i];
		var definition = null;


		definition = buildDefinition(entity);
		if(!definition)
			return callback({"message" : "Error : cannot build definitions"});

		definitions.push(definition);
		definitionsMapperTmp[entity.identifier] = definition;


		DynamicEntity.findOne({where : { identifier : entity.identifier}})
		.then(function(rec){
			/*	we are inside a anonimous function that uses global variables as definition of the mother function
				this function will get the state of the global variables at the while it is changing because of a external loop.
				That means, the function was declared and a global variable state as 1, for example.
				but when the this function execute, that global variable cound have a different state, as 5 for example.
				we cannot trust that this anonimous function will have the state of the external global variable at the time
				it was declared. it depends on the time when it executes.
				i got errors here, because 'definition' was looping 5 times. I was expecting that this anonimous function
				would have each of the 5 states. But instead, when all the 5 anonimous functions were running, all of them 
				had the same state.

				Problem solved using a object mapper 'definitionsMapperTmp', getting the info nededed by a key 'rec.identifier'.
			*/

			if(!rec){
				var error = 'DynamicEntity not found when should be.';
				logger.error(error);
				if(!loopError){
					loopError = true;
					return callback(error);
				}
			}


			rec.meta = JSON.stringify(definitionsMapperTmp[rec.identifier], null, null);
			rec.sequelizeModel = JSON.stringify(definitionsMapperTmp[rec.identifier].sequelizeModel, null, null);
			rec.sequelizeOptions = JSON.stringify(definitionsMapperTmp[rec.identifier].sequelizeOptions, null, null);
		

			rec.save().then(function(){

				//we need to check if this is the final assync function of success, and only then callback success.
				loopCount++;
				if(loopCount == loopTotal)
					registerModelsWhenReady(definitions, callback);

			})
			.catch(function(e){
				var error = 'save error on DynamicEntities when saving meta: ' + e;
				logger.error(error);
				if(!loopError){
					loopError = true;
					return callback(error);
				}
			});

		}).catch(function(e){
			var error = 'findOne error on DynamicEntities: ' + e;
			logger.error(error);
			if(!loopError){
				loopError = true;
				return callback(error);
			}
			//else the callback was already called and a rollback will occur.
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