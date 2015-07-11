var logger = require('winston');
var PlatformError = require('../utils/platformerror');
var db = require('../utils/database');
var AppClient = require('../models/appclient');

var TokenDao = require('./accesstokendao');
var RouterAccess = require('./routeraccessdao');

var AppClientDao = function(){

}

var resultToObject = function(result){
    //client : {"id":10,"oauth_id":"99","oauth_secret":"b","name":"a","user_id":44}
    if (!result)
        return null;
    
    var client = new AppClient();

    client.id = result.id;
    client.authSecret = result.auth_secret;
    client.clientName = result.client_name;
    client.description = result.description;

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

AppClientDao.prototype.getByName = function(clientName, callback){

    var query = "SELECT * FROM app_client where client_name = $1";

    db.query(query, [clientName], function(err, result){
        
        if(err){
            logger.error("AppClientDao getByName error: " + err);
            return callback(err,null);
        }

        callback(null, resultToObject(result.rows[0]));
    });
}

// //Don't have an OauthId anymore
// AppClientDao.prototype.getByOauthId = function(id, callback){
//     var query = "SELECT * FROM app_client where oauth_id = $1";
//     db.query(query, [id], function(err, result){
//         if(err){
//             logger.error("AppClientDao getByOauthId error: " + err);
//             return callback(err,null);
//         }
//         callback(null, resultToObject(result.rows[0]));
//     });
// }

AppClientDao.prototype.insert = function(appclient, callback){

    if (false === (appclient instanceof AppClient)) {
        throw new PlatformError('AppClientDao: appclient constructor called without "new" operator');
        return;
    }

    var query = 'INSERT INTO app_client (auth_secret, client_name, description) VALUES ($1, $2, $3) RETURNING ID';

    db.query(query, [appclient.authSecret, appclient.clientName, appclient.description], function(err, result){
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

AppClientDao.prototype.deleteByNameAndId = function(name, id, callback){


    AppClientDao.prototype.getById(id, function(Err, client){

        if(Err) return callback(Err, null);

        if(client.clientName == name){

            var tDao = new TokenDao();

            tDao.deleteByClientId(client.id, function(err, result){

                if(err) return callback(err, null);

                var routerDao = new RouterAccess();

                routerDao.deleteByClientId(client.id, function(err, result){

                    if(err) return callback(err, null);

                    var query = 'DELETE FROM app_client WHERE id = $1 and client_name = $2';

                    db.query(query, [id, name], function(err, result){

                        if(err) logger.error(err);

                        logger.warn('AppClientDao : deleteByNameAndId >> PLEASE -- Fix this Gambiarra');
                        callback(err, result);
                    });
                });
            });
        }
    });
}

module.exports = AppClientDao;
