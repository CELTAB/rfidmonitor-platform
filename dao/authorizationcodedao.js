// var logger = require('winston');
// var PlatformError = require('../utils/platformerror');
// var db = require('../utils/database');
// var AuthorizationCode = require('../models/authorizationcode');

// var AuthorizationCodeDao = function(){

// }

// var resultToObject = function(result){
//     if (!result)
//         return null;

//     var code = new AuthorizationCode();

//     code.id = result.id;
//     code.value = result.value;
//     code.redirectUri = result.redirect_uri;
//     code.userId = result.user_id;

//     return code;
// }

// AuthorizationCodeDao.prototype.getAll = function(callback){

//     var query = "SELECT * FROM authorization_code";

//     db.query(query, [], function(err, result){
        
//         if(err){
//             logger.error("AuthorizationCodeDao getAll error: " + err);
//             return callback(err,null);
//         }

//         var resultToArray = require('../utils/baseutils').resultToArray;
//         callback(null, resultToArray.toArray(resultToObject, result.rows));
//     });

// }

// AuthorizationCodeDao.prototype.getByValue = function(value, callback){

//     var query = "SELECT * FROM authorization_code where value = $1";

//     db.query(query, [value], function(err, result){
        
//         if(err){
//             logger.error("AuthorizationCodeDao getByValue error: " + err);
//             return callback(err,null);
//         }

//         callback(null, resultToObject(result.rows[0]));
//     });

// }

// AuthorizationCodeDao.prototype.deleteById = function(id, callback){

//     var query = "DELETE FROM authorization_code where id = $1";

//     db.query(query, [id], function(err, result){
        
//         if(err){
//             logger.error("AuthorizationCodeDao deleteById error: " + err);
//             return callback(err);
//         }

//         logger.info("AuthorizationCodeDao: authcode deleted with ID: " + id);

//         callback(null);
//     });

// }

// AuthorizationCodeDao.prototype.insert = function(authcode, callback){

//     if (false === (authcode instanceof AuthorizationCode)) {
//         throw new PlatformError('AuthorizationCodeDao: authcode constructor called without "new" operator');
//         return;
//     }

//     var query = 'INSERT INTO authorization_code (value, redirect_uri, user_id) VALUES ($1, $2, $3) RETURNING ID';

//     db.query(query, [authcode.value, authcode.redirectUri, authcode.userId], function(err, result){
//         if(err){
//             var msg = "AuthorizationCodeDao insert " + err;
//             logger.error(msg);
//             return callback(msg, null);
//         }

//         var id = result.rows[0].id;     
//         logger.info("AuthorizationCodeDao: New authcode inserted with ID: " + id);

//         callback(null, id);

//     });         
// }

// module.exports = AuthorizationCodeDao;
