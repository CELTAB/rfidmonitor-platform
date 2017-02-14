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

var logger = require('winston');
var SequelizeClass = require('sequelize');
var path = require('path');
//bug
var pg = require('pg');
delete pg.native;
//end - bug
var PlatformError = require(__base + 'utils/platformerror');
var DEValidator = require(__base + 'controller/dynamic/devalidator');
var sequelize = require(__base + 'controller/database/platformsequelize');
var deModelPool = require(__base + 'controller/dynamic/demodelpool');
var DynamicEntity = require(__base + 'models/dynamicentity');

// var DynamicEntity = sequelize.model('DynamicEntity');

/**
* Manages Dynamic Entities
* @class
*/
var DynamicEntities = function (){
	deValidator = new DEValidator(sequelize);
}

/**
* Removes the database information about an Dynamic Entity persisted, but
* that is related to some failure in the process, as an dependend entity failing
* when registering.
* @param  {Object} entities Entities array to be removed.
* @return {void}
* @memberof DynamicEntities
*/
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

/**
* Receives an entity definition object from client, in a raw state.
* It is going to be processed, structured and persisted in the database.
* @param  {JSON}   json     Is the raw JSON that contains the entities definitons.
* @param  {Function} callback callback for when done, that received an error as parameter.
* @return {void}
*/
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
			//Create a route for each new entity to allow DAO operations
			var routes = require(__base + 'controller/database/routes');
			newEntities.forEach(function(entity) {
				routes.register('/api/dao/' + entity.identifier, {all: true});
			});

			callback(errors); //errors can be null or something.
		});
	});
}

/**
* Received an validated and structured entity specification, and build a Sequelize definiton for it.
* @param  {Object}   entity   the entity definition, sent from the client, structured and validated.
* @param  {Function} callback callback for when done, that receives the resulting entity as parameter. A null object in the parameter means error.
* @return {void}
* @memberof DynamicEntities
*/
var buildDefinition = function(entity, callback){
	var definition = {};
	definition.identifier = entity.identifier;
	definition.sequelizeModel = {} ;
	definition.sequelizeOptions = {
		paranoid : true,
		freezeTableName: true,
		tableName: 'tb_de_' + entity.identifier,
		classMethods: {
			associate: []
		}
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
		logger.debug("Unique Constraint: " + JSON.stringify(uqConstraint));

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

	logger.debug("Unique Map: " + JSON.stringify(uniqueMap));

	for (var i in entity.structureList){
		var field = entity.structureList[i];

		if(field.type == DEValidator.prototype.typesEnum.ENTITY){

			field.name = field.identifier;
			field.identifier = field.identifier + '_id';

			definition.sequelizeModel[field.identifier] = {
				type: 'Sequelize.INTEGER',
				references: {
					model: 'tb_de_' + field.name, // Can be both a string representing the table name, or a reference to the model
					key:   "id"
					//, deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
				}
			}

			definition.sequelizeOptions.classMethods.associate.push({modelName: definition.identifier, targetName: field.name, foreignKey: field.identifier});
		}else if(field.type == DEValidator.prototype.typesEnum.GROUP){

			field.name = field.identifier;
			field.identifier = field.identifier + '_group_id';

			definition.sequelizeModel[field.identifier] = {
				type: 'Sequelize.INTEGER',
				references: {
					model: 'tb_plat_group', // Can be both a string representing the table name, or a reference to the model
					key:   "id"
					//, deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
				}
			}
			definition.sequelizeOptions.classMethods.associate.push({modelName: definition.identifier, targetName: 'Group', foreignKey: field.identifier});
		}else if(field.type == DEValidator.prototype.typesEnum.IMAGE){

			field.name = field.identifier;
			field.identifier = field.identifier + '_platform_media';

			definition.sequelizeModel[field.identifier] = {
				type: 'Sequelize.STRING',
				allowNull : true,
				references: {
					model: 'tb_plat_platform_media', // Can be both a string representing the table name, or a reference to the model
					key:   "uuid"
					//, deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
				}
			}

		}else{
			try{
				field.name = field.identifier;

				definition.sequelizeModel[field.identifier] = {
					type : deValidator.typesEnumToSequelize(field.type) ,
					allowNull : field.allowNull
				}
			}catch(e){
				logger.error("buildDefinition error on deValidator.typesEnumToSequelize: " + e);
				//null means problem
				return callback(null);
			}
		}

		//Sets unique on the field if in the map
		if(uniqueMap[field.name])
			definition.sequelizeModel[field.identifier].unique = uniqueMap[field.name];
	}

	DynamicEntity.findOne({where : { identifier : entity.identifier}})
	.then(function(rec){

		if(!rec){
			var error = 'DynamicEntity not found when should be.';
			logger.error(error);
			if(!loopError){
				loopError = true;
				return callback(null);
			}
		}

		rec.meta = JSON.stringify(entity, null, null);
		rec.save().then(function(){
			return callback(definition);
		})
		.catch(function(e){
			var error = 'save error on DynamicEntities when saving meta: ' + e;
			logger.error(error);
			if(!loopError){
				loopError = true;
				return callback(null);
			}
		});

	}).catch(function(e){
		var error = 'findOne error on DynamicEntities: ' + e;
		logger.error(error);
		if(!loopError){
			loopError = true;
			return callback(null);
		}
		//else the callback was already called and a rollback will occur.
	});
}

/**
 * Function called to load in the system/sequelize the ready entities
 * @param  {Object}   definitions The new validated,structured and well defined entities to load in the sequelize.
 * @param  {Function} callback    callback for when is done, receiving as parameter an error.
 * @return {void}
 * @memberof DynamicEntities
 */
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

/**
 * Receives an array of entities, and request the Sequelize definition build. After the build, this function
 * saves on database the new information generated for the given entities.
 * @param  {Array}   entities Requested entities specifications
 * @param  {Function} callback callback for when done. Receive error as parameter.
 * @return {void}
 * @memberof DynamicEntities
 */
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

		buildDefinition(entity, function(definition){
			if(!definition)
			return callback({"message" : "Error : cannot build definitions"});

			definitions.push(definition);
			definitionsMapperTmp[definition.identifier] = definition;

			logger.debug("rec.identifier2: " + definition.identifier);

			DynamicEntity.findOne({where : { identifier : definition.identifier}})
			.then(function(rec){
				/*	We are inside an anonymous function that uses global variables as definition comming from the perent function.
				This function will get the state of the global variables while it is changing, because of a external loop.
				That means, the function was declared as in a global state as 1, for example.
				But when this function executes, that global variable cound have a different state, as 5 for example.
				We cannot trust that this anonymous function will have the state of the external global variable at the time
				it was declared. It depends on the execution time. I have got errors here, because the 'definition'
				was looping 5 times. I was expecting that this anonymous function would have each of the 5 states. But instead,
				when all the 5 anonymous functions were running, all of them had the same state.

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

				rec.sequelizeModel = JSON.stringify( definitionsMapperTmp[rec.identifier].sequelizeModel, null, null);
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
		});
	}
}

/**
* Check if the given variable is an object.
* @memberof DynamicEntities
* @param  {Object}  a The given variable for checking.
* @return {Boolean}   If it is object or not.
*/
var isObject = function(a) {
	return (!!a) && (a.constructor === Object);
};

/**
* Check if the given variable is an array.
* @memberof DynamicEntities
* @param  {Array}  a The given variable for checking.
* @return {Boolean}   If it is array or not.
*/
var isArray = function(a) {
	return (!!a) && (a.constructor === Array);
};

/**
* Check if the given object has not attributes.
* @memberof DynamicEntities
* @param  {Object}  a The given variable for checking.
* @return {Boolean}   If it has zero attributes or not.
*/
var isObjectEmpty = function(a){
	return Object.keys(a).length == 0;
}

module.exports = DynamicEntities;
