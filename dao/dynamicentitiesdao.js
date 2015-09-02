var db = require('../utils/database');
var logger = require('winston');
var PlatformError = require('../utils/platformerror');
var resultToArray = require('../utils/baseutils').resultToArray;

var DynamicEntitiesDao = function(){ 

}

DynamicEntitiesDao.prototype.createTable = function(query, callback){
	logger.debug("DynamicEntitiesDao.prototype.createTable is going to execute: " + query);
	
	db.query(query, [], function(err, result){
		if(err){
			logger.error("DynamicEntitiesDao createTable error : " + err);
			return callback(err);
		}

		callback(null);
	});
}

module.exports = DynamicEntitiesDao;