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
    try{
        var User = sequelize.model("User");
        User.scope('loginScope').findOne({where: {username: req.body.username}})
        .then(function(user){
          if(!user || !user.isPasswordValid(req.body.password))
            return errorHandler('Invalid username or password', 400, callback);

          var AppClient = sequelize.model('AppClient');
          AppClient.find({where: {userId: user.id}}).then(function(app){
            if(!app)
              return errorHandler('Token not found for user ' + user.username, 400, callback);

            user.token = app.token;
            req.appSession.user = user.clean();
            return callback(null, {message: user.clean()});
          });
        });
    }catch(e){
      return errorHandler('Internal Error: ' + e.toString(), 500, callback);
    }
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
