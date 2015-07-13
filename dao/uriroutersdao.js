var logger = require('winston');
var PlatformError = require('../utils/platformerror');
var db = require('../utils/database');
var uriRouter = require('../models/urirouter');

var UriRoutersDao = function(){

}

var resultToObject = function(result){
    if (!result)
        return null;
    
    var uri = new uriRouter();

    uri.id = result.id;
    uri.route = result.route;

    return uri;
}

UriRoutersDao.prototype.insert = function(uriroute, callback){

	var query = "INSERT INTO uri_routers (route) VALUES ($1) RETURNING ID";

	db.query(query, [uriroute], function(err, result){
		if(err){
			logger.error("UriRoutersDao insert error : " + err);
			return callback(err,null);
		}

		var id = result.rows[0].id;		
		logger.debug("New uriroute Inserted id: " + id);
		callback(null, id);
	});
}

UriRoutersDao.prototype.getRouteById = function(routeId, callback){

	var query = "SELECT * FROM uri_routers WHERE id = $1";

	db.query(query, [routeId], function(err, result){
		if(err){
			logger.error("UriRoutersDao getRouteById error : " + err);
			callback(err, null);
			return;
		}

		callback(null, resultToObject(result.rows[0]));
	});
}

UriRoutersDao.prototype.getAll = function(callback){

	var query = "SELECT * FROM uri_routers";

	db.query(query, [], function(err, result){
        if(err){
            logger.error("UriRoutersDao getRouters error: " + err);
            return callback(err,null);
        }

        var resultToArray = require('../utils/baseutils').resultToArray;
        callback(null, resultToArray.toArray(resultToObject, result.rows));
	});
}

module.exports = UriRoutersDao;

