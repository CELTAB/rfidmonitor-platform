var logger = require('winston');
var PlatformError = require('../utils/platformerror');
var db = require('../utils/database');
var uriRouter = require('../models/urirouter');
var resultToArray = require('../utils/baseutils').resultToArray;

var UriRoutersDao = function(){

}

var fromDbObj = function(dbObj){
    if (!dbObj)
        return null;
    
    var uri = new uriRouter();

    uri.id = dbObj.id;
    uri.route = dbObj.route;

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

		callback(null, fromDbObj(result.rows[0]));
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
        callback(null, resultToArray.toArray(fromDbObj, result.rows));
	});
}

module.exports = UriRoutersDao;

