var Sequelize = require('sequelize');
var path = require('path');
var logger = require('winston');
var pg = require('pg');
delete pg.native;	
var PlatformError = require('../utils/platformerror');
var DEValidator = require('./devalidator');


var DynamicEntities = function (){
	var connectionString = 'postgres://rfidplatform:rfidplatform@localhost:5432/rfidplatform';
	sequelize = new Sequelize(connectionString);
	deValidator = new DEValidator(sequelize);
	ClientObjRaw = require('../models/orm/clientobjraw')(sequelize);
	
	// modelsORMPath = path.join(__dirname, '../models/orm');
	// ClientObjRaw = sequelize.import(path.join(modelsORMPath, '/clientobjraw'));

	sequelize.sync({force : true});

}


DynamicEntities.prototype.registerEntity = function(json, callback){

	//Checks each object integrity
	var errors = deValidator.validateClientRootArray(json);
	if(errors)
		return callback(errors);

	for (var i in json){
		var clientObj = json[i];

		var strObj = JSON.stringify(clientObj);

		logger.debug("DynamicEntities.prototype.registerEntity : ClientObjRaw " + strObj);
		
		ClientObjRaw.create({obj : strObj})
		.then(function(c){
			logger.debug('ClientObjRaw OK');
		})
		.catch(function(e){
			errors.push(e);
		});
	}

	return callback(errors);
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