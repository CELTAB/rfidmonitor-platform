var logger = require('winston');
var PlatformError = require('../utils/platformerror');
var db = require('../utils/database');
var AccessMethods = require('../models/accessmethods.js');

var AccessMethodsDao = function(){

}

AccessMethodsDao.prototype.insert = function(methodName, callback){

    var query = 'INSERT INTO access_methods (method_name) VALUES ($1) RETURNING ID';

    db.query(query, [methodName], function(err, result){
        if(err){
            var msg = "AccessMethodsDao insert " + err;
            logger.error(msg);
            return callback(msg, null);
        }

        var id = result.rows[0].id;     
        logger.info("AccessMethodsDao: New RouterAccess inserted with ID: " + id);

        callback(null, id);
    });    
}

AccessMethodsDao.prototype.getMethodById = function(methodId, callback){

	var query = "SELECT * FROM access_methods WHERE id = $1";

	db.query(query, [methodId], function(err, result){
        if(err){
            var msg = "AccessMethodsDao getMethodById " + err;
            console.log(msg);
            logger.error(msg);
            return callback(msg, null);
        }

        callback(null, {id: result.rows[0].id, methodName: result.rows[0].method_name});
	});
}

module.exports = AccessMethodsDao;