var logger = require('winston');
var routes = require(__base + 'controller/database/routes');

var RoutingCore = function(router, baseUri){
	this.router = router;
	this.baseUri = baseUri || '';

	this.registerRoute = function(routeName, functions){
		/* functions:
			{
				getOne: "controllerFunctionName",
				getAll: "controllerFunctionName",
				save: "controllerFunctionName",
				update: "controllerFunctionName",
				remove: "controllerFunctionName",
				routeName: 'routeName',
				customRoute: [{'route', 'functionHandler', 'midler'}]
			}
		*/
		var _route = "/" + routeName;
		var _routeId = _route + "/:id";
		var dbRoute = this.baseUri + _route;
		routes.register(dbRoute, routes.getMethods().GET);
		this.router.get(_route, function(req, res){
			var query = null;
			if(req.query && req.query.q){
				query = req.query.q;
				try{
					query = JSON.parse(query);
				}catch(e){
					return res.status(400).send("Query parse error: " +e);
				}
			}
			if(!query)
				query = {};

			functions.getAll(null, query, function(err, result){
				if(err) return res.response(err.error, err.code, err.message);

				res.send(result);
			});
		});

		this.router.get(_routeId, function(req, res){
			functions.getOne(req.params.id, null, function(err, result){
				if(err) return res.response(err.error, err.code, err.message);

				if(!result)
					return res.response('Error on ' + routeName, 404, 'ID not found');
				res.send(result);
			});
		});

		routes.register(dbRoute, routes.getMethods().POST);
		this.router.post(_route, function(req, res){
			if(req.body._id || req.body.id)
				return res.response(null, 400, "Anti-pattern POST: body contains _id");

			functions.save(req.body, function(err, result){
				if(err) return res.response(err.error, err.code, err.message);

				res.send(result);
			});
		});

		routes.register(dbRoute, routes.getMethods().PUT);
		this.router.put(_routeId, function(req, res){
			if(req.params.id != req.body._id && req.params.id != req.body.id)
				return res.response(null, 400, "Anti-pattern PUT: params id is different of body id.");

			functions.update(req.body, function(err, result){
				if(err) return res.response(err.error, err.code, err.message);

				res.send(result);
			});
		});

		routes.register(dbRoute, routes.getMethods().DELETE);
		this.router.delete(_routeId, function(req, res){
			functions.remove(req.params.id, function(err, result){
				if(err) return res.response(err.error, err.code, err.message);

				res.send(result);
			});
		});

		//Need to create custom routes?
		if(functions.customRoute && functions.customRoute.length > 0){
			this.registerCustomRoute(functions.customRoute);
		}
	}

	/*
	Create custom routes, receives an objetc with the methos, route and handler for this custom route
	*/
	this.registerCustomRoute = function(customRoutesArray){
		//object:
		/*
		{
			getOne: ...
			...
			name: ...
			customRoute: [
				{
					method: 'post',
					route: 'rota/comlexa',
					handler: [Function] //function(req, callback){return callback(errObj, responseObj)};
					middler: [Function] // function(req, res, next) {return next();};
				}
			]
		}
		*/

		customRoutesArray.forEach(function(route){
			var method = route.method;
			var defaultHandler = function(req, res){
				route.handler(req, function(err, response, attr){
					if(err){
						return res.status(err.code).send(err);
					}
					if(attr)
						return res[attr](response);

					res.send(response);
				});
			}

			if(!route.middler){
				route.middler = function(req, res, next){
					return next();
				}
			}

			var rt = route.route.split('/:');
			switch(method){
				case 'get':
					routes.register(this.baseUri + rt[0], routes.getMethods().GET);
					this.router.get(route.route, route.middler, defaultHandler);
					break;
				case 'post':
					routes.register(this.baseUri + rt[0], routes.getMethods().POST);
					this.router.post(route.route, route.middler, defaultHandler);
					break;
				case 'put':
					routes.register(this.baseUri + rt[0], routes.getMethods().PUT);
					this.router.put(route.route, route.middler, defaultHandler);
					break;
				case 'delete':
					routes.register(this.baseUri + rt[0], routes.getMethods().DELETE);
					this.router.delete(route.route, route.middler, defaultHandler);
					break;
			}
		}, this);
	}
}

module.exports = RoutingCore;
