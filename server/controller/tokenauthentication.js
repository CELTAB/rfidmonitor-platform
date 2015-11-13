'use strict';
var logger = require('winston');
var BearerStrategy = require('passport-http-bearer').Strategy
var passport = require('passport');
var sequelize = require(__base + 'controller/database/platformsequelize');

var DEVELOPMENT = __DevEnv;
var TokenAuthentication = function(app){
  this.app = app;
  passport.use('api-bearer', new BearerStrategy({}, validateToken));
  this.useBearer = function(uri){
    this.app.use(uri, passport.authenticate('api-bearer', { session: false }));
    this.app.use(uri, validateAccess);
  };
};

var validateToken = function(token, done){
  //If development mode is active, just go ahead without validate token
  if(DEVELOPMENT){
    return done(null, true);
  }

  var AppClient = sequelize.model('AppClient');
  AppClient.findOne({where: {token: token}})
  .then(function(client){
    if(!client) return done(null, false);

    return done(null, {clientId: client.id}, {scope: '*'});
  })
  .catch(function(e){
    return done(e);
  });
};

var validateAccess = function(req, res, next){
  if(!req.originalUrl){
    var errMessage = 'originalUrl missing';
    logger.warn(errMessage);
    return res.response(errMessage, 400, errMessage);
  }
  var uriArray = req.originalUrl.split('/');
  if(uriArray.length < 3 || uriArray[2] === undefined || uriArray[2] == ''){
    var msg = 'What a such bad request...';
    return res.response(msg, 400, 'There is something wrong with your URL');
  }

  //Lets get the position 1 and 2 always.
  var finalRoute = '/'+uriArray[1]+'/'+uriArray[2];
  //Remove eventual queries
  finalRoute = finalRoute.split('?')[0];
  logger.debug('Searching on authorization table for this uri: ' + finalRoute);

  //If development mode is active, just go ahead without validate access permissions
  if(DEVELOPMENT){
    return next();
  }

  var RouteAccess = sequelize.model('RouteAccess');
  var UriRoute = sequelize.model('UriRoute');
  RouteAccess.findOne(
    {
      where : { appClient: req.user.clientId},
      include: [
        {
          model: UriRoute,
          where: {
            path: { $or : ['ANY', finalRoute] },
            method : { $or : ['ANY', req.method] }
          }
        }
      ]
    }
  )
  .then(function(access){
    if(access)
      return next(); //Access granted
    else
      return res.response('Get out dog.', 403, 'Token not allowed for this opperation');
  })
  .catch(function(e){
    return res.response(e, 500, 'INTERNAL ERROR: ' + e.toString());
  });
};

module.exports = TokenAuthentication;
