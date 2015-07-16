var logger = require('winston');
var PlatformError = require('../utils/platformerror');
var db = require('../utils/database');

var Routes = function Routes(){

	var routesList = [];
    
    this.register = function(path, method){

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
				logger.debug("Route already on database.");
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
				logger.info("Route inserted with ID: " + id);
				routesList.push({"id" : id, "path" : path , "method" : method });
			});
		});

	}

	this.getRoutes = function(){
		return routesList;
	}
 
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