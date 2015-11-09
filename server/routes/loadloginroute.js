'use strict';
var logger = require('winston');
var express = require('express');
var RoutingCore = require(__base + 'routes/routingcore');
var errorHandler = require(__base + 'utils/errorhandler');
var sequelize = require(__base + 'controller/database/platformsequelize');

var LoadLoginRoutes = function(baseUri){
  var router = express.Router();
  var routingCore = new RoutingCore(router, baseUri || '');
  var loginHandler = function(req, callback){
		if(!req.body.username || !req.body.password)
      return errorHandler('Missing username ou password', 400, callback);

    var UserCtrl = require(__base + 'controller/models/user'); //Needs to be here.
    UserCtrl.login(req.body, function(err, user){
      if(err){
        logger.error(err);
        return callback(err);
      }

      req.appSession.user = user;
      return callback(null, user);
    });
  };

  var logoutHandler = function(req, callback){
    delete req.appSession.user;
    return callback(null, '/login', 'redirect');
  };

  var _hasSession = function(req){
    // return true; //Uncomment to use on test enviroment
    return (req.appSession && req.appSession.user)? true: false;
  };

  var Route = require(__base + 'utils/customroute');
  var routes = [
    new Route('post', '/login', loginHandler),
    new Route('post', '/logout', logoutHandler)
  ];
  routingCore.registerCustomRoute(routes);

  return {
    routes: router,
    hasSession: _hasSession
  };
};

module.exports = LoadLoginRoutes;
