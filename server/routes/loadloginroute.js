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
          AppClient.find({where: {user_id: user.id}}).then(function(app){
            if(!app)
              return errorHandler('Token not found for user ' + user.username, 400, callback);
            //TODO: Set session information
            // req.appSession.user = {id: user.id, username: user.username, email: user.email} || user.clean();
            user.token = app.token;
            return callback(null, {message: user.clean()});
          });
        });
    }catch(e){
      return errorHandler('Internal Error: ' + e.toString(), 500, callback);
    }
  };

  var logoutHandler = function(req, callback){
    //TODO: delete session information
    // delete req.appSession.user;
    return callback(null, '/login', 'redirect');
  };

  var Route = require(__base + 'utils/customroute');
  var routes = [
    new Route('post', '/login', loginHandler),
    new Route('post', '/logout', logoutHandler)
  ];

  routingCore.registerCustomRoute(routes);
  return router;
};

module.exports = LoadLoginRoutes;
