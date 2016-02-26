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
var sequelize = require(__base + 'controller/database/platformsequelize');
var Controller = require(__base + 'controller/basemodelctrl');
var errorHandler = require(__base + 'utils/errorhandler');

var GroupModel = sequelize.model('Group');
var Group = new Controller(GroupModel, 'groups');

Group.custom['save'] = function(body, callback){
  var save = function(){
    return Group.save(body, callback);
  }
  try{
    GroupModel.findOne({where: {isDefault: true}})
    .then(function(group){
      if(!group){
        body.isDefault = true;
        return save();
      }
      if(body.id === group.id){
        body.isDefault = true;
        return save();
      }else{
        if(body.isDefault !== true)
          return save();
        group.isDefault = null;
        group.save().then(save);
      }
    })
    .catch(function(e){
      return errorHandler(e.toString(), 500, callback);
    });
  }catch(e){
    return errorHandler(e.toString(), 500, callback);
  }
};

Group.custom['remove'] = function(id, callback){
  Group.find(id, null, function(err, group){
    if(err)
      return callback(err);
    if(!group)
      return errorHandler('Group not found', 400, callback);
    if(group.isDefault)
      return errorHandler('Not allowed to delete default group', 400, callback);
    Group.remove(id, callback);
  });
};

module.exports = Group;
