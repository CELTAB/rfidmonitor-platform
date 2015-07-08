var logger = require('winston');
var RouterAccess = require('../models/routeraccess');
var RouterAccessDao = require('../dao/routeraccessdao');

var RouterAccessController = function(){

}

RouterAccessController.prototype.hasAuthorization = function(requestInfo, callback){

        var rDao = new RouterAccessDao();

        rDao.getAccess(requestInfo, function(err, result){

                if(err) return callback(false);

                if(result){
                        callback(true);
                }else{
                        callback(false);
                }
        });
}

module.exports = RouterAccessController;


 // var accessInfo = new RouterAccess();

 //        var rDao = new UriRoutersDAO();
 //        var aDao = new AccessMethodsDAO();

 //        if(result.rows[0]){
 //        	var rAccess = result.rows[0];
 //        	accessInfo.id = rAccess.id;

 //        	rDao.getRouteById(rAccess.uri_routers_id, function(err, router){

 //        		if(err) return callback(err, null);

 //        		accessInfo.uriRoute = route.route;

 //        		aDao.getMethodById(rAccess.access_methods_id, function(err, method){
 //        			if(err) return callback(err, null);

 //        			accessInfo.accessMethod = method.methodName;
 //        			callback(null, accessInfo);
 //        		});
 //        	});
 //        }