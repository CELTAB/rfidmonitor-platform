'use strict';
var logger = require('winston');
var express = require('express');
var RoutingCore = require(__base + 'routes/routingcore');

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
	Controllers.register(require(controllerPath + '/register'));

	var customRoutes = [];
	var routeDePath = __base + 'routes/de';
	var routeOriginal = require(routeDePath + '/original');
	var routeMeta = require(routeDePath + '/meta');
	var routeActive = require(routeDePath + '/active');
	var routeDao = require(routeDePath + '/dedao');
	var routeMedia = require(__base + 'routes/media');

	customRoutes = customRoutes
		.concat(routeOriginal)
		.concat(routeActive)
		.concat(routeMeta)
		.concat(routeMedia)
		.concat(routeDao);
	//Create controllers based on all Saquelize models
	// Controllers.loadControllers();

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
