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

var DeCtrl = {name: 'de/register', custom: {}, customRoute:[]};
DeCtrl.isValid = function(){return true};

// This function can be placed inside utils
var notAllowedMethod = function(){
  var errMessage = 'Interaction with de/register is Not Allowed. Only for save';
  var response = {code: 403, message: errMessage, error: 'Not Allowed'};
  return {
    update: function(){
      return function(a, callback){
        return callback(response);
      }
    },
    find: function(){
      return function(a, b, callback){
        return callback(response);
      }
    }
  };
}();

DeCtrl.custom['find'] = notAllowedMethod.find();
DeCtrl.custom['update'] = notAllowedMethod.update();
DeCtrl.custom['remove'] = notAllowedMethod.update();
DeCtrl.custom['save'] = function(body, callback){
  var dynamicEntities = new (require(__base + 'controller/dynamic/dynamicentities'))();
  dynamicEntities.registerEntity(body, function(errors){
    if(errors)
      return callback({code: 500, error: errors, message: 'Error on save dynamic entity'});
    return callback(null, {"message" : "OK"});
  });
};

module.exports = DeCtrl;
