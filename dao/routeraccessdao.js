var logger = require('winston');
var PlatformError = require('../utils/platformerror');
var db = require('../utils/database');
var RouterAccess = require('../models/routeraccess.js');
var AccessMethodsDAO = require('./accessmethodsdao');
var UriRoutersDAO = require('./uriroutersdao');
var resultToArray = require('../utils/baseutils').resultToArray;

var RouterAccessDao = function(){

}

var fromDbObj = function(dbObj){ 
    if (!dbObj)
        return null;
    
    var access = new RouterAccess();

    access.id = dbObj.id;
    access.appClientId = dbObj.app_client_id;
    access.uriRoutersId = dbObj.uri_routers_id;

    return access;
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

	var query = "select * from router_access as r, uri_routers as u where r.app_client_id = $1 and r.uri_routers_id = u.id and u.path = $2 and u.method = $3";

	db.query(query, [accessInfo.clientId, accessInfo.route, accessInfo.methodName], function(err, result){
        if(err){
            var msg = "RouterAccessDao getAccess " + err;
            logger.error(msg);
            return callback(msg, null);
        }

        var access = {};

        if(result.rows[0]){
			callback(null, fromDbObj(result.rows[0]));			
        }else{
            //Auth not found.
        	callback(null, null);
        }
    });
}

RouterAccessDao.prototype.deleteByClientId = function(clientId, callback){

    var query = 'DELETE FROM router_access WHERE app_client_id = $1';

    db.query(query, [id], function(err, result){
        if(err){
            logger.error("RouterAccessDao deleteById error : " + err);
            callback(err, null);
            return;
        }
        callback(null, result.rowCount);
    });
}

module.exports = RouterAccessDao;