/****************************************************************************
**
** Copyright (C) 2015
**                     Gustavo Valiati <gustavovaliati@gmail.com>
**                     Thiago R. M. Bitencourt <thiago.mbitencourt@gmail.com>
**
** This file is part of the FishMonitoring project
**
** This program is free software; you can redistribute it and/or
** modify it under the terms of the GNU General Public License
** as published by the Free Software Foundation; version 2
** of the License.
**
** This program is distributed in the hope that it will be useful,
** but WITHOUT ANY WARRANTY; without even the implied warranty of
** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
** GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License
** along with this program; if not, write to the Free Software
** Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
**
****************************************************************************/

'use strict';
var logger = require('winston');
var BearerStrategy = require('passport-http-bearer').Strategy
var passport = require('passport');
var sequelize = require(__base + 'controller/database/platformsequelize');

var DEVELOPMENT = __DevEnv;
var imageToken = 'onlyImageToken';

/**
 * Handles the token authentication in the API requests using the Bearer method.
 * @param {Object} app the Express instance
 * @class
 */
var TokenAuthentication = function(app){
  this.app = app;
  passport.use('api-bearer', new BearerStrategy({}, validateToken));
  this.useBearer = function(uri){
    this.app.use(uri, verifyImage);
    this.app.use(uri, passport.authenticate('api-bearer', { session: false }));
    this.app.use(uri, validateAccess);
  };
};

/**
 * Validates the token for the media route.
 * @param  {Object}   req  Express request object.
 * @param  {Object}   res  Express response object.
 * @param  {Function} next callback function that trigger the next middleware.
 * @return {void}
 * @memberof TokenAuthentication
 */
var verifyImage = function(req, res, next){
  getFinalRoute(req, res, function(finalRoute){
    if(finalRoute === '/api/media'){
      req.headers.authorization = 'Bearer ' + imageToken;
    }
    return next();
  });
};

/**
 * Process the request to extract the route
 * @param  {Object}   req  Express request object.
 * @param  {Object}   res  Express response object.
 * @param  {Function} next callback function that trigger the next middleware.
 * @return {void}
 * @memberof TokenAuthentication
 */
var getFinalRoute = function(req, res, next){
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
  var finalRoute = null;
  if (uriArray.length > 3 && uriArray[2] !== 'media') {
    finalRoute = '/' + uriArray[1] + '/' + uriArray[2] + '/' + uriArray[3];
  } else {
    finalRoute = '/' + uriArray[1] + '/' + uriArray[2];
  }
  //Remove eventual queries
  finalRoute = finalRoute.split('?')[0];
  return next(finalRoute);
};

/**
 * Verifies whether the given token is valid, and returns the client id.
 * @param  {String}   token the client token present in the resquest.
 * @param  {Function} done  callback for when done.
 * @return {void}
 * @memberof TokenAuthentication
 */
var validateToken = function(token, done){
  //If development mode is active, just go ahead without validating the token
  if(DEVELOPMENT || token === imageToken){
    return done(null, {clientId: token});
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

/**
 * Verifies whether the client has permission to access the requested route
 * @param  {Object}   req  Express request object.
 * @param  {Object}   res  Express response object.
 * @param  {Function} next callback function that trigger the next middleware.
 * @return {void}
 * @memberof TokenAuthentication
 */
var validateAccess = function(req, res, next){
  getFinalRoute(req, res, function(finalRoute){
    logger.debug('Searching on authorization table for this uri: ' + finalRoute);
    //If development mode is active, just go ahead without validate access permissions
    if(DEVELOPMENT || req.user.clientId === imageToken){
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
        return res.response('Token not allowed for this opperation', 403, 'Missing permission to access ' + finalRoute + ' resource with ' + req.method + ' method');
    })
    .catch(function(e){
      return res.response(e, 500, 'INTERNAL ERROR: ' + e.toString());
    });
  });
};

module.exports = TokenAuthentication;
