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

var UserModel = sequelize.model('User');
var UserCtrl = new Controller(UserModel, 'users');

UserCtrl.custom['save'] = function(body, callback){
  if(body.id || body._id)
    return UserCtrl.save(body, callback);

  UserCtrl.save(body, function(err, user){
    if(err)
      return callback(err);

    var AppClient = sequelize.model('AppClient');
    var app = {description: 'Default appClient for ' + user.username, userId: user.id};
    AppClient.create(app).then(function(appCreated){
      user = user.clean();
      user.appClient = appCreated;
      return callback(null, user);
    }).catch(function(e){
      return errorHandler('Error on create appClient: ' + e.toString(), 500, callback);
    });
  });
};

UserCtrl.login = function(candidateUser, callback){
  var User = sequelize.model("User");
  User.scope('loginScope').findOne({where: {username: candidateUser.username}})
  .then(function(user){
    if(!user || !user.isPasswordValid(candidateUser.password))
      return errorHandler('Invalid username or password', 400, callback);

    var AppClient = sequelize.model('AppClient');
    AppClient.find({where: {userId: user.id}}).then(function(app){
      if(!app)
        return errorHandler('Token not found for user ' + user.username, 400, callback);

      user.token = app.token;
      return callback(null, user.clean());
    });
  })
  .catch(function(e){
    return errorHandler('Internal Error: ' + e.toString(), 500, callback);
  });
};

module.exports = UserCtrl;
