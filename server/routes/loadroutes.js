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

/**
 * Load the static and dynamic controllers, look up for default and custom routes, and register all of them.
 * @param {String} baseUri If informed, sets the route path preceding the endpoints.
 * @class
 */
var LoadRoutes = function(baseUri){
	var router = express.Router();
	var ControllersPool = require(__base + 'controller/controllersModelPool');
	var Controllers = new ControllersPool();

	//Load Controllers
	var controllerPath = __base + 'controller/models';
	Controllers.register(require(controllerPath + '/rfiddata'));
	Controllers.register(require(controllerPath + '/group'));
	Controllers.register(require(controllerPath + '/collector'));
	Controllers.register(require(controllerPath + '/appclient'));
	Controllers.register(require(controllerPath + '/user'));
	Controllers.register(require(controllerPath + '/uriroute'));
	Controllers.register(require(controllerPath + '/routeaccess'));

	//Load Controller for dynamic entities
	controllerPath = __base + 'controller/dynamic';

	var customRoutes = [];
	var routeDePath = __base + 'routes/de';
	var routeDao = require(routeDePath + '/dedao');
	var routeMedia = require(__base + 'routes/media');
	var routeDynamic = require(routeDePath + '/dynamicroutes');

	customRoutes = customRoutes
	.concat(routeMedia)
	.concat(routeDao)
	.concat(routeDynamic);

	//Create controllers based on all Saquelize models
	// Controllers.loadControllers();

	/**
	 * This function is responsible for getting the controller methods and applying then to one of
	 * the structured operations.
	 * @param  {Object} controller is the given container to build up the routing.
	 * @return {Object}            Functions: getOne, getAll, save, update, remove, name, customRoute. The methods are
	 * attached firstly looking for custom definitions, and after that by the default ones.
	 */
	var _passFunctions = function(controller){
		var custom = controller.custom;
		return{
			getOne: custom.getOne || custom.find || controller.find,
			getAll: custom.getAll || custom.find || controller.find,
			save: custom.save || controller.save,
			update: custom.update || custom.save || controller.save,
			remove: custom.remove || controller.remove,
			name: controller.name,
			customRoute: controller.customRoute
		}
	};

	var routingCore = new RoutingCore(router, baseUri || '');
	var controllersPool = Controllers.getAll();

	for(var key in controllersPool){
		logger.debug('Registering route for ' + key);
		var controller = controllersPool[key];
		routingCore.registerRoute(controller.name, _passFunctions(controller));
	}

	routingCore.registerCustomRoute(customRoutes);

	return router;
}

module.exports = LoadRoutes;
