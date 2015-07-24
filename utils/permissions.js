var logger = require('winston');
var PlatformError = require('../utils/platformerror');
var db = require('../utils/database');

var Permissions = function Permissions(){

    this.findByAppClientId = function(id, callback){
    	if(!id){
    		callback(new PlatformError("findPermissionsByAppClientId: Invalid id ["+id+"] to search on database."), null);
    	}

    	logger.debug("Finding permissions for AppClient id: [" + id + "]");

		var query = 'SELECT u.path, u.method FROM router_access as r, uri_routers as u WHERE u.id = r.uri_routers_id AND app_client_id = $1';

		db.query(query, [id], function(err, permissions){
			if (err) {
				return callback(err, null);
			}

			logger.warn("Permission being returned to user with raw database informations.");

			return callback(null, permissions.rows);

		});
	}

    this.findByToken= function(token, callback){
        if(!token){
            callback(new PlatformError(" Permission findByToken: Invalid token ["+token+"] to search on database."), null);
        }

        logger.debug("Finding permissions for token: [" + token + "]");

        var query = 'SELECT rout.path, rout.method'+
        ' FROM router_access as acc, uri_routers as rout, access_token tok'+
        ' WHERE tok.value = $1'+
        ' AND tok.app_client_id = acc.app_client_id'+
        ' AND acc.uri_routers_id = rout.id';

        db.query(query, [token], function(err, permissions){
            if (err) {
                return callback(err, null);
            }

            logger.warn("Permission being returned to user with raw database informations.");

            return callback(null, permissions.rows);

        });
    }
 
    if(Permissions.caller != Permissions.getInstance){
        throw new PlatformError("This object cannot be instanciated");
    }
}
 
Permissions.instance = null;
 

Permissions.getInstance = function(){
    if(this.instance === null){
        this.instance = new Permissions();
    }
    return this.instance;
}
 
module.exports = Permissions.getInstance();