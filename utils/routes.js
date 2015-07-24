var logger = require('winston');
var PlatformError = require('../utils/platformerror');
var db = require('../utils/database');

var Routes = function Routes(){

	var routesList = [];

	var methods = {
		GET: "GET",
		POST: "POST",
		PUT: "PUT",
		DELETE: "DELETE",
		ANY : "ANY"
	};

	this.getMethods = function(){
		return methods;
	}

	this.getRoutesList = function(){
		return routesList;
	}

	this.isMethodValid = function(method){
		if(!method)
			return false;

		switch(method){
			case methods.GET:
				return true;
			case methods.POST:
				return true;
			case methods.PUT:
				return true;
			case methods.DELETE:
				return true;
			case methods.ANY:
				return true;
			default:
				return false;
		}
	}
    
    this.register = function(path, method){
    	if(!this.isMethodValid(method))
    		return new PlatformError("Routes: Invalid method ["+method+"] to register on database.");

    	logger.debug("Registering route: [" + path + "] - [" + method + "]");

		var query = 'SELECT * FROM uri_routers WHERE path = $1 AND method = $2';

		db.query(query, [path, method], function(err, result){
			if (err) {
				logger.error("routes register " + err);
				return;
			}

			if(result.rowCount > 1){
				logger.error("routes register more than 1.");
				return;
			}

			if(result.rowCount == 1 ){
				logger.debug("Route already on database: [" + path + "] - [" + method + "]");
				routesList.push({id : result.rows[0].id, "path" : path , "method" : method });
				return;
			}

			// not found. inserting.

			var query = 'INSERT INTO uri_routers (path, method) VALUES ($1, $2) RETURNING ID';

			db.query(query, [path, method], function(err, result){
				if(err){
					var msg = "routes register insert " + err;
					logger.error(msg);
					return ;
				}
				var id = result.rows[0].id;
				logger.debug("Route inserted on database: [" + path + "] - [" + method + "]");
				routesList.push({"id" : id, "path" : path , "method" : method });
			});
		});

	}

	this.getRoutes = function(){
		return routesList;
	}

	logger.warn("Registering route path [ANY] method [ANY]");
	this.register('ANY','ANY');
 
    if(Routes.caller != Routes.getInstance){
        throw new PlatformError("This object cannot be instanciated");
    }
}
 
Routes.instance = null;
 

Routes.getInstance = function(){
    if(this.instance === null){
        this.instance = new Routes();
    }
    return this.instance;
}
 
module.exports = Routes.getInstance();