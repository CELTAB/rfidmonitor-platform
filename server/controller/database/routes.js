var logger = require('winston');
var PlatformError = require(__base + 'utils/platformerror');
var SeqUriRoute = require(__base + 'models/uriroute');

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
		return methods[method] ? true : false;
	}

	this.register = function(path, method){
  	if(!this.isMethodValid(method))
  		return new PlatformError("Routes: Invalid method ["+method+"] to register on database.");

  	logger.debug("Registering route: [" + path + "] - [" + method + "]");

    SeqUriRoute
		.findOrCreate({where: {path: path, method: method}, defaults: {path: path, method: method}})
		.spread(function(route, created) {
			if(created){
				logger.debug("Route inserted on database: [" + path + "] - [" + method + "]");
			}else{
				logger.debug("Route already on database: [" + path + "] - [" + method + "]");
			}

			routesList.push({"id" : route.id, "path" : route.path , "method" : route.method });
		})
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
