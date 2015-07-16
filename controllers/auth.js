// Load required packages
var logger = require('winston');

var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy

var User = require('../models/user');
var UserDao = require('../dao/userdao');

var AppClient = require('../models/appclient');
var AppClientDao = require('../dao/appclientdao');

var AccessToken = require('../models/accesstoken');
var AccessTokenDao = require('../dao/accesstokendao');

var userDao = new UserDao();
var appClientDao = new AppClientDao();
var accessTokenDao = new AccessTokenDao();

passport.use(new BasicStrategy(
  function(username, password, callback) {
    logger.debug('BasicStrategy');
    userDao.getByUsername(username, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      userDao.verifyRawPassword(user, password, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        logger.debug("BasicStrategy : SUCCESS");
        return callback(null, user);
      });
    });
  }
));

// TODO: Fix this method... Don't work anymore
passport.use('client-basic', new BasicStrategy(
    function(username, password, callback) {
        logger.warn("This Doesn't work anymore... Please, fix it");

        logger.debug('BasicStrategy : client-basic : username=' + username + ' pass=' + password);
        // WARNING username and password are arrive as plain text. TODO
        appClientDao.getByName(username, function (err, client) {

            if (err) { return callback(err); }

            logger.debug("BasicStrategy : client : " +JSON.stringify(client)); 

            // No client found with that id or bad password
            if (!client || client.authSecret !== password) { return callback(null, false); }

            // Success
            logger.debug("BasicStrategy : client-basic : SUCCESS");
            return callback(null, client);
        });
    }
));


var bearerAuth = function(accessTokenValue, callback) {
    logger.debug('BearerStrategy');
    accessTokenDao.getByValue(accessTokenValue, function (err, token) {

        if (err) { return callback(err); }

        // No token found
        if (!token) { return callback(null, false); }

        // TODO: CHANGE FOR APP_CLIENT_DAO
        appClientDao.getById(token.appClientId , function (err, client) {
            if (err) { return callback(err); }

            // No user found
            if (!client) { return callback(null, false); }

            // Simple example with no scope
            logger.debug("BearerStrategy : SUCCESS");
            callback(null, {clientId: client.id, clientName: client.clientName}, { scope: '*' });
        });
    });
  }

passport.use(new BearerStrategy(bearerAuth));

// exports.isAuthenticated = passport.authenticate('basic', { session : false });
exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session : false });
exports.isClientAuthenticated = passport.authenticate('client-basic', { session : false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });




