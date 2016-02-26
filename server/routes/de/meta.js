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
var errorHandler = require(__base + 'utils/errorhandler');
var DynamicEntity = sequelize.model('DynamicEntity');

var metaHandler = function(req, callback){
  if(req.params.entity){
    DynamicEntity.findOne({where : { identifier : req.params.entity }})
    .then(function(entity){
      if(entity){
        return callback(null, JSON.parse(entity.meta));
      }else{
        return errorHandler('Entity not found', 400, callback);
      }
    })
    .catch(function(e){
      return errorHandler(e.toString(), 500, callback);
    });
  }else{
    DynamicEntity.findAll(
      {attributes : ['meta'], where: {active: true}}
    )
		.then(function(entities){
			var response = [];
			for(var i in entities){
				response.push(JSON.parse(entities[i].meta));
			}
      return callback(null, response);
		})
		.catch(function(e){
      return errorHandler(e.toString(), 500, callback);
		});
  }
};

var Route = require(__base + 'utils/customroute');
var routes = [
  new Route('get', '/de/meta', metaHandler),
  new Route('get', '/de/meta/:entity', metaHandler)
];

module.exports = routes;
