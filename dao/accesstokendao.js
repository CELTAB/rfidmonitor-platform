// TODO Just like we did for user passwords, you should implement a strong hashing scheme for the access token. Never store them as plain text as we are in this example.

var logger = require('winston');
var PlatformError = require('../utils/platformerror');
var db = require('../utils/database');
var AccessToken = require('../models/accesstoken');

var AccessTokenDao = function(){

}

var fromDbObj = function(result){
    //client : {"id":10,"oauth_id":"99","oauth_secret":"b","name":"a","user_id":44}
    if (!result)
        return null;
    
    var token = new AccessToken();

    token.id = result.id;
    token.value = result.value;
    token.appClientId = result.app_client_id;

    return token;
}

AccessTokenDao.prototype.getAll = function(callback){

    var query = "SELECT * FROM access_token";

    db.query(query, [], function(err, result){
        
        if(err){
            logger.error("AccessTokenDao getAll error: " + err);
            return callback(err,null);
        }

        var resultToArray = require('../utils/baseutils').resultToArray;
        callback(null, resultToArray.toArray(fromDbObj, result.rows));
    });
}

AccessTokenDao.prototype.getByValue = function(value, callback){

    var query = "SELECT * FROM access_token where value = $1";

    db.query(query, [value], function(err, result){
        
        if(err){
            logger.error("AccessTokenDao getByValue error: " + err);
            return callback(err,null);
        }

        callback(null, fromDbObj(result.rows[0]));
    });

}


AccessTokenDao.prototype.insert = function(accessToken, callback){

    if (false === (accessToken instanceof AccessToken)) {
        throw new PlatformError('AccessTokenDao: authcode constructor called without "new" operator');
        return;
    }

    var query = 'INSERT INTO access_token (value, app_client_id) VALUES ($1, $2) RETURNING ID';

    db.query(query, [accessToken.value, accessToken.appClientId], function(err, result){
        if(err){
            var msg = "AccessTokenDao insert " + err;
            logger.error(msg);
            return callback(msg, null);
        }

        var id = result.rows[0].id;     
        logger.info("AccessTokenDao: New accessToken inserted with ID: " + id);

        callback(null, id);

    });         
}

AccessTokenDao.prototype.deleteByClientId = function(clientId, callback){
    var query = 'DELETE FROM access_token WHERE app_client_id = $1';

    db.query(query, [clientId], function(err, result){

        if(err) logger.error(err);

        logger.warn('AccessTokenDao : deleteByClientId >> PLEASE -- Fix this Gambiarra');
        callback(err, result);
    });
}

module.exports = AccessTokenDao;
