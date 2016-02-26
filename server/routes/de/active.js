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
var DynamicEntity = sequelize.model('DynamicEntity');
var deModelPool = require(__base + 'controller/dynamic/demodelpool');
var errorHandler = require(__base + 'utils/errorhandler');

var activeHandler = function(req, callback){
  if(!deModelPool.getModel(req.params.entity))
		return errorHandler('Invalid Entity.', 400, callback);

  var value = req.path.indexOf('deactivate') !== -1 ? false : true;
  DynamicEntity.findOne({
		where: { identifier: req.params.entity}
	})
  .then(function(entity){
    if(!entity)
      return errorHandler('Invalid Entity.', 400, callback);

    entity.active = value;
    entity.save().then(function(ok){
      return callback(null, 'OK');
    });
  })
  .catch(function(e){
    return errorHandler(500, e.toString(), callback);
  });
}

var Route = require(__base + 'utils/customroute');
var routes = [
  new Route('put', '/de/activate/:entity', activeHandler),
  new Route('put', '/de/deactivate/:entity', activeHandler)
];

module.exports = routes;
