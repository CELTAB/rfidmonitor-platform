var logger = require('winston');

var RoutingCore = function(router){
	this.router = router;

	this.registerRoute = function(routeName, functions){
		// routeName: "produto"

		// routeController: controller object

		/* functions:
			{
				getOne: "controllerFunctionName",
				getAll: "controllerFunctionName",
				save: "controllerFunctionName",
				update: "controllerFunctionName",
				remove: "controllerFunctionName"
			}
		*/
		
		var _route = "/" + routeName;
		var _routeId = _route + "/:id"; 

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

				res.send(result);
			});
		});

		this.router.post(_route, function(req, res){

			if(req.body._id || req.body.id)
				return res.response(null, 400, "Anti-pattern POST: body contains _id");

			functions.save(req.body, function(err, result){
				if(err) return res.response(err.error, err.code, err.message);

				res.send(result);
			});
		});

		this.router.put(_routeId, function(req, res){
	
			//TODO: Verificar por _id e tbm por id em todo o código que verifica ID
			if(req.params.id != req.body._id && req.params.id != req.body.id)
				return res.response(null, 400, "Anti-pattern PUT: params id is different of body id.");

			functions.update(req.body, function(err, result){
				if(err) return res.response(err.error, err.code, err.message);

				res.send(result);
			});
		});

		this.router.delete(_routeId, function(req, res){

			functions.remove(req.params.id, function(err, result){
				if(err) return res.response(err.error, err.code, err.message);

				res.send(result);
			});
		});
	}
}

module.exports = RoutingCore;