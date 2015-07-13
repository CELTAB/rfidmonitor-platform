//TODO
/*

// Execute before each user.save() call
UserSchema.pre('save', function(callback) {
  var user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});

*/
var logger = require('winston');
var PlatformError = require('../utils/platformerror');
var db = require('../utils/database');
var bcrypt = require('bcrypt-nodejs');

var User = require('../models/user');

var UserDao = function(){

}

var resultToObject = function(result){
    /*
    Use it like this: 
        var resultToArray = require('../utils/baseutils').resultToArray;
        callback(null, resultToArray.toArray(resultToObject, result.rows));
    */
    if (!result)
        return null;
    
    var user = new User();

    user.id = result.id;
    user.name = result.name;
    user.email = result.email;
    user.username = result.username;
    user.password = result.password;

    return user;
}

UserDao.prototype.getAll = function(callback){

    var query = "SELECT * FROM user_platform";

    db.query(query, [], function(err, result){
        
        if(err){
            logger.error("UserDao getAll error: " + err);
            return callback(err,null);
        }

        callback(null, result.rows);
    });

}

UserDao.prototype.getByUsername = function(username, callback){

    var query = "SELECT * FROM user_platform WHERE username = $1";

    db.query(query, [username], function(err, result){
        
        if(err){
            logger.error("UserDao getByUsername error: " + err);
            return callback(err,null);
        }

        if(result.rowCount > 1 )
            return new PlatformError("UserDao : Multiple users with same username");

        //TODO return a User object, insted of a direct from db object.
        callback(null, result.rows[0]);
    });

}

UserDao.prototype.getById = function(id, callback){

    var query = "SELECT * FROM user_platform WHERE id = $1";

    db.query(query, [id], function(err, result){
        
        if(err){
            logger.error("UserDao getById error: " + err);
            return callback(err,null);
        }

        if(result.rowCount > 1 )
            return new PlatformError("UserDao : Multiple users with same id");

        //TODO return a User object, insted of a direct from db object.
        callback(null, result.rows[0]);
    });

}

var hashPassword = function(user, callback){
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return callback(err, null);

        user.password = hash;
        callback(null, user);
    });
}

//user == user from db, password == password trying to be authenticated.
UserDao.prototype.verifyRawPassword = function(user, password, cb) {

  bcrypt.compare(password, user.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserDao.prototype.insert = function(user, callback){

    if (false === (user instanceof User)) {
        throw new PlatformError('UserDao: user constructor called without "new" operator');
        return;
    }

    hashPassword(user, function(err, user){

        if(err) return callback(err, null);

        var query = 'INSERT INTO user_platform (username, password, email, name) VALUES ($1, $2, $3, $4) RETURNING ID';

        db.query(query, [user.username, user.password, user.email, user.name], function(err, result){
            if(err){
                var msg = "UserDao insert " + err;
                logger.error(msg);
                return callback(msg, null);
            }

            var id = result.rows[0].id;     
            logger.info("UserDao: New user inserted with ID: " + id);

            callback(null, id);

        });        
    }); 
}



module.exports = UserDao;
