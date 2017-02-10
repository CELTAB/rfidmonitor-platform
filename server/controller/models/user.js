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
var sequelize = require(__base + 'controller/database/platformsequelize');
var Controller = require(__base + 'controller/basemodelctrl');
var errorHandler = require(__base + 'utils/errorhandler');
var logger = require('winston');

var UserModel = sequelize.model('User');
var UserCtrl = new Controller(UserModel, 'users');
var RouteAccess = sequelize.model('RouteAccess');
var UriRoute = sequelize.model('UriRoute');
var AppClient = sequelize.model('AppClient');

/**
 * Custom function. Before removing checks if there are AppClients related.
 * @memberof ModelControllers.User
 */
UserCtrl.custom['remove'] = function(id, callback) {
  AppClient.count({where: {userId: id}})
  .then(function(total){
    if(!total) {
      return UserCtrl.remove(id, callback);
    } else {
      return errorHandler("There are AppClients related to this User", 400, callback);
    }
  })
  .catch(function(e){
    return errorHandler("Error on find AppClient related", 404, callback);
  });
};

/**
 * Custom function. Changes behavior between inserting or updating a register. Also, creates a
 * default AppClient for the user.
 * @memberof ModelControllers.User
 */
UserCtrl.custom['save'] = function(body, callback){
  if(body.id || body._id)
    return UserCtrl.save(body, callback);

  UserCtrl.save(body, function(err, user){
    if(err)
      return callback(err);

    var AppClient = sequelize.model('AppClient');
    var app = {description: 'Default appClient for ' + user.username, userId: user.id, def: true};
    AppClient.create(app).then(function(appCreated){
      user = user.clean();
      user.appClient = appCreated;
      return callback(null, user);
    }).catch(function(e){
      return errorHandler('Error on create appClient: ' + e.toString(), 500, callback);
    });
  });
};

/**
 * New function. Implements the login by username and password. Gives back to the
 * client his token and authorized routes.
 * @param  {Object}   candidateUser contains the user's credentials
 * @param  {Function} callback      callback for when done. Receives the first argument
 * for errors, and the second is the user object if the credentials are valid.
 * @return {void}
 * @memberof ModelControllers.User
 */
UserCtrl.login = function(candidateUser, callback){
  UserModel.scope('loginScope').findOne({where: {username: candidateUser.username}})
  .then(function(user){
    if(!user || !user.isPasswordValid(candidateUser.password))
      return errorHandler('Invalid username or password', 400, callback);

    var AppClient = sequelize.model('AppClient');
    AppClient.find({where: {userId: user.id, def: true}}).then(function(app){
      if(!app)
        return errorHandler('Token not found for user ' + user.username, 400, callback);

      var cleanRoute = function(obj) {
        delete obj.deletedAt;
        delete obj.createdAt;
        delete obj.updatedAt;
        return obj;
      }

      user.token = app.token;
      RouteAccess.findAll({where: {appClient: app.id}, include:[{model: UriRoute}]})
      .then(function(routes) {
        if (Array.isArray(routes)) {
          var res = [];
          routes.forEach(function(route) {
            var tmp = route.get({plain: true}).UriRoute;
            res.push(cleanRoute(tmp));
          });
          user.routes = res;
        } else {
            var tmp = routes.get({plain: true}).UriRoute;
            user.routes = [cleanRoute(tmp)];
        }
        return callback(null, user.clean());
      })
      .catch(function(err) {
        return errorHandler('Error on load routes' + err.toString(), 500, callback);
      });
    });
  })
  .catch(function(e){
    return errorHandler('Internal Error: ' + e.toString(), 500, callback);
  });
};

module.exports = UserCtrl;
