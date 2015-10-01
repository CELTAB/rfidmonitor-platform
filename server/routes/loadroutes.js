var express = require('express');

// var CollectorsRoute = require(__base + 'routes/collectors');
var RoutingCore = require(__base + 'routes/routingcore');

var LoadRoutes = function(){

	router = express.Router();

	// var GroupCtrl = require(__base + 'controller/groups');
	// var CollectorCtrl = require(__base + 'controller/collectors');

	var controllersPool = [];

	//Load Controllers
	controllersPool.push(require(__base + 'controller/groups'));
	controllersPool.push(require(__base + 'controller/collectors'));
	controllersPool.push(require(__base + 'controller/users'));

	var _passFunctions = function(controller){

		var custom = controller.custom;

		if(custom.find)
			console.log("Tenho uma função personalizada para find");
		else
			console.log("NÃO Tenho uma função personalizada para find");

		if(custom.getOne)
			console.log("Tenho uma função personalizada para getOne");
		else
			console.log("NÃO Tenho uma função personalizada para getOne");

		if(custom.getAll)
			console.log("Tenho uma função personalizada para getAll");
		else
			console.log("NÃO Tenho uma função personalizada para getAll");

		if(custom.save)
			console.log("Tenho uma função personalizada para save");
		else
			console.log("NÃO Tenho uma função personalizada para save");
		
		if(custom.update)
			console.log("Tenho uma função personalizada para update");
		else
			console.log("NÃO Tenho uma função personalizada para update");

		if(custom.remove)
			console.log("Tenho uma função personalizada para remove");
		else
			console.log("NÃO Tenho uma função personalizada para remove");


		return{
			getOne: custom.getOne || custom.find || controller.find,
			getAll: custom.getAll || custom.find || controller.find,
			save: custom.save || controller.save,
			update: custom.update || custom.save || controller.save,
			remove: custom.remove || controller.remove,
			name: controller.name
		}
	};

	var routingCore = new RoutingCore(router);
	
	controllersPool.forEach(function(controller){

		console.log("Registrando Rotas para " + controller.name.toLowerCase());
		//TODO. Tudo bem fazer assim?
		routingCore.registerRoute(controller.name.toLowerCase() + 's', _passFunctions(controller));
	});

	// routingCore.registerRoute("collectors", _passFunctions(CollectorCtrl));
	// routingCore.registerRoute("groups", _passFunctions(GroupCtrl));

	return router;
}

module.exports = LoadRoutes;