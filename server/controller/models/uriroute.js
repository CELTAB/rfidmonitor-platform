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

var RoutesModel = sequelize.model('UriRoute');
var RoutesCtrl = new Controller(RoutesModel, 'routes');

/**
 * Not allowed operation response.
 * @param  {Function} callback callback for when done, passing the error as parameter.
 * @return {void}
 * @memberof ModelControllers
 */
var changeFunc = function(body, callback){
  var errMessage = {error: "Not Allowed", code: 403, message: "You are not allowed to make any change on UriRoutes"};
	callback(errMessage);
};

/**
 *  Custom function. Implements the not allowed operation response.
 * @memberof ModelControllers
 */
RoutesCtrl.custom['remove'] = changeFunc;

/**
 *  Custom function. Implements the not allowed operation response.
 * @memberof ModelControllers
 */
RoutesCtrl.custom['save'] = changeFunc;

module.exports = RoutesCtrl;
