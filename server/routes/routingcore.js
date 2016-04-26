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
			/*
				If the middler arrives as an object it means that the route may be anonymous, and also have a Function middler, that's why the verifications is made.
				Object example:
				{
					middler: function() { return next();},
					anonymous: true
				}
				It also accept only the middler function or only the anonymous attribute, as: {anonymous: true}
			*/
			var anonymous = false;
			var defaultMiddler = function(req, res, next){
				return next();
			}
			if (!route.middler) {
				route.middler = defaultMiddler;
			} else {
				if (typeof route.middler === 'object') {
						anonymous = route.middler.anonymous ? route.middler.anonymous : anonymous;
						route.middler = route.middler.middler || defaultMiddler;
				}
			}

			var rt = route.route.split('/:');
			switch(method){
				case 'get':
					if (!anonymous)
						routes.register(this.baseUri + rt[0], routes.getMethods().GET);
					this.router.get(route.route, route.middler, defaultHandler);
					break;
				case 'post':
					if (!anonymous)
						routes.register(this.baseUri + rt[0], routes.getMethods().POST);
					this.router.post(route.route, route.middler, defaultHandler);
					break;
				case 'put':
					if (!anonymous)
						routes.register(this.baseUri + rt[0], routes.getMethods().PUT);
					this.router.put(route.route, route.middler, defaultHandler);
					break;
				case 'delete':
					if (!anonymous)
						routes.register(this.baseUri + rt[0], routes.getMethods().DELETE);
					this.router.delete(route.route, route.middler, defaultHandler);
					break;
			}
		}, this);
	}
}

module.exports = RoutingCore;
