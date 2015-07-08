// TODO Just like we did for user passwords, you should implement a strong hashing scheme for the access token. Never store them as plain text as we are in this example.

var logger = require('winston');
var PlatformError = require('../utils/platformerror');
var db = require('../utils/database');
var AccessToken = require('../models/accesstoken');

var AccessTokenDao = function(){

}

AccessTokenDao.prototype.getAll = function(callback){

    var query = "SELECT * FROM access_token";

    db.query(query, [], function(err, result){
        
        if(err){
            logger.error("AccessTokenDao getAll error: " + err);
            return callback(err,null);
        }

        callback(null, result.rows);
    });

}

AccessTokenDao.prototype.getByValue = function(value, callback){

    var query = "SELECT * FROM access_token where value = $1";

    db.query(query, [value], function(err, result){
        
        if(err){
            logger.error("AccessTokenDao getByValue error: " + err);
            return callback(err,null);
        }

        callback(null, result.rows[0]);
    });

}


AccessTokenDao.prototype.insert = function(accessToken, callback){

    if (false === (accessToken instanceof AccessToken)) {
        throw new PlatformError('AccessTokenDao: authcode constructor called without "new" operator');
        return;
    }

    var query = 'INSERT INTO access_token (value, user_id) VALUES ($1, $2) RETURNING ID';

    db.query(query, [accessToken.value, accessToken.userId], function(err, result){
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

module.exports = AccessTokenDao;
