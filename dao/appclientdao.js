var logger = require('winston');
var PlatformError = require('../utils/platformerror');
var db = require('../utils/database');
var AppClient = require('../models/appclient');

var AppClientDao = function(){

}

var resultToObject = function(result){
    //client : {"id":10,"oauth_id":"99","oauth_secret":"b","name":"a","user_id":44}
    if (!result)
        return null;
    
    var client = new AppClient();

    client.id = result.id;
    client.oauthId = result.oauth_id;
    client.oauthSecret = result.oauth_secret;
    client.name = result.name;
    client.userId = result.user_id;

    return client;
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

AppClientDao.prototype.getAll = function(callback){

    var query = "SELECT * FROM app_client";

    db.query(query, [], function(err, result){
        
        if(err){
            logger.error("AppClientDao getAll error: " + err);
            return callback(err,null);
        }

        callback(null, resultArrayToObjectArray(result.rows));
    });

}

AppClientDao.prototype.getById = function(id, callback){

    var query = "SELECT * FROM app_client where id = $1";

    db.query(query, [id], function(err, result){
        
        if(err){
            logger.error("AppClientDao getById error: " + err);
            return callback(err,null);
        }

        callback(null, resultToObject(result.rows[0]));
    });

}

AppClientDao.prototype.getByOauthId = function(id, callback){

    var query = "SELECT * FROM app_client where oauth_id = $1";

    db.query(query, [id], function(err, result){
        
        if(err){
            logger.error("AppClientDao getByOauthId error: " + err);
            return callback(err,null);
        }

        callback(null, resultToObject(result.rows[0]));
    });

}

AppClientDao.prototype.insert = function(appclient, callback){

    if (false === (appclient instanceof AppClient)) {
        throw new PlatformError('AppClientDao: appclient constructor called without "new" operator');
        return;
    }

    var query = 'INSERT INTO app_client (oauth_id, oauth_secret, name, user_id) VALUES ($1, $2, $3, $4) RETURNING ID';

    db.query(query, [appclient.oauthId, appclient.oauthSecret, appclient.name, appclient.userId], function(err, result){
        if(err){
            var msg = "AppClientDao insert " + err;
            logger.error(msg);
            return callback(msg, null);
        }

        var id = result.rows[0].id;     
        logger.info("AppClientDao: New appclient inserted with ID: " + id);

        callback(null, id);

    });         
}



module.exports = AppClientDao;
