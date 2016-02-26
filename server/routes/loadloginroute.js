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
