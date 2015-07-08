var logger = require('winston');
var PlatformError = require('../utils/platformerror');
var db = require('../utils/database');
var RouterAccess = require('../models/routeraccess.js');
var AccessMethodsDAO = require('./accessmethodsdao');
var UriRoutersDAO = require('./uriroutersdao');

var RouterAccessDao = function(){

}

var resultToObject = function(result){
    //client : {"id":10,"oauth_id":"99","oauth_secret":"b","name":"a","user_id":44}
    if (!result)
        return null;
    
    var access = new RouterAccess();

    access.id = result.id;
    access.appClient = result.app_client_id;
    access.uriRoute = result.uri_routers_id;
    access.accessMethod = result.access_methods_id;

    return access;
}

var resultArrayToObjectArray = function(resultArray){
    logger.warn("resultArrayToObjectArray : Function not tested.");

    if(resultArray.length == 0)
        return [];

    var objArray = [];
    for (var i in resultArray) {
      val = resultArray[i];
      objArray.push(resultToObject(val));
    }
    return objArray;
}

RouterAccessDao.prototype.insert = function(routeraccess, callback){

    if (false === (routeraccess instanceof RouterAccess)) {
        throw new PlatformError('RouterAccessDao: routeraccess constructor called without "new" operator');
        return;
    }

    var query = 'INSERT INTO router_access (app_client_id, uri_routers_id, access_methods_id) VALUES ($1, $2, $3) RETURNING ID';

    db.query(query, [routeraccess.appClientId, routeraccess.uriRouterId, routeraccess.accessMethodId], function(err, result){
        if(err){
            var msg = "RouterAccessDao insert " + err;
            logger.error(msg);
            return callback(msg, null);
        }

        var id = result.rows[0].id;     
        logger.info("RouterAccessDao: New RouterAccess inserted with ID: " + id);

        callback(null, id);
    });    
}

RouterAccessDao.prototype.getAccess = function(accessInfo, callback){

	var query = "select * from router_access as r, uri_routers as u, access_methods as a where r.app_client_id = $1 and r.uri_routers_id = u.id and u.route = $2 and r.access_methods_id = a.id and a.method_name = $3";

	db.query(query, [accessInfo.clientId, accessInfo.route, accessInfo.methodName], function(err, result){
        if(err){
            var msg = "RouterAccessDao insert " + err;
            logger.error(msg);
            return callback(msg, null);
        }

        var access = {};

        if(result.rows[0]){
			access.clientId = result.rows[0].app_client_id;
			access.route = result.rows[0].route;
			access.methodName = result.rows[0].method_name;

			callback(null, access);
			
        }else{
        	callback(null, null);
        }
    });
}

module.exports = RouterAccessDao;