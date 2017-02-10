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

var AccessModel = sequelize.model('RouteAccess');
var AccessCtrl = new Controller(AccessModel, 'routeaccess');

/**
 * Custom function. Validates the body. Remove every access rules for the given appclient, and recreate
 * the rules using the new definition from the body.
 * @memberof ModelControllers.RouteAccess
 */
AccessCtrl.custom['save'] = function(body, callback){
  if (Array.isArray(body) && body.length > 0) {

    var appId = body[0].appClient;
    AccessModel.destroy({where: {appClient: appId, deletedAt: null}})
    .then(function() {

      AccessModel.bulkCreate(body)
      .then(function() {
        return callback(null, {message: "OK", total: body.length});
      })
      .catch(function(e){
        if (e.name.indexOf("SequelizeUniqueConstraintError") !== -1) {
          var code = 400;
          var errMes = e.message;
          e.errors.forEach(function(err) {
            errMes += ". " + err.type + ": " + err.path;
          });
        }
        return errorHandler(errMes || e.toString(), code || 500, callback);
      });

    })
    .catch(function(err) {
      return errorHandler("Error on remove previous route access", 500, callback);
    });

  } else {
    return errorHandler("Object invalid or empty. Must be an array", 400, callback);
  }
};

module.exports = AccessCtrl;
