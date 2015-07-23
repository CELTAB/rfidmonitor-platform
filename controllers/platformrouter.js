var express = require('express');

var logger = require('winston');
var BearerStrategy = require('passport-http-bearer').Strategy
var passport = require('passport');

var User = require('../models/user');
var UserDao = require('../dao/userdao');

var AppClient = require('../models/appclient');
var AppClientDao = require('../dao/appclientdao');

var AccessToken = require('../models/accesstoken');
var AccessTokenDao = require('../dao/accesstokendao');

var RouterAccess = require('../models/routeraccess');
var RouterAccessDao = require('../dao/routeraccessdao');

var Collector = require('../models/collector');
var CollectorDao = require('../dao/collectordao');

var Group = require('../models/group');
var GroupDao = require('../dao/groupdao');

var routes = require('../utils/routes');



var PlatformRouter = function(){

	router = express.Router();
	userDao = new UserDao();
	appClientDao = new AppClientDao();
	accessTokenDao = new AccessTokenDao();
	routerAccessDao = new RouterAccessDao();
	collectorDao = new CollectorDao();
	groupDao = new GroupDao();

	passport.use('api-bearer', new BearerStrategy({}, validateBearer));
	setAuthorization();

	setRouteUsers();
	setRouteAppClients();
	setRouteCollectors();
	setRouteGroups();
	setRouteRfiddata();
	setRoutePermissions();

	return router;
}

var validateBearer = function(token, done) {
	logger.debug('validateBearer');

	accessTokenDao.getByValue(token, function (err, token) {

        if (err) { return done(err); }

        // No token found
        if (!token) { return done(null, false); }

        appClientDao.getById(token.appClientId , function (err, client) {
            if (err) { return done(err); }

            // No user found
            if (!client) { return done(null, false); }

            // Simple example with no scope
            logger.debug("BearerStrategy : SUCCESS");
            done(null, {clientId: client.id, clientName: client.clientName}, { scope: '*' });
        });
    });
}

var setAuthorization = function(){
	router.all(
		'*', 
		passport.authenticate('api-bearer', { session: false }), 
		function(req, res, next){
			var finalRoute = null;

			if(!req._parsedOriginalUrl || !req._parsedOriginalUrl.pathname){
				logger.warn("_parsedOriginalUrl not found");
				return res.status(400).json({'message':'_parsedOriginalUrl not found'});
			}
			
			var uriArray = req._parsedOriginalUrl.pathname.split('/');

			/*
			//Example: /api/collectors/1/2/3
				For this uri 'https://localhost/api/collectors/1/2'
				The uriArray will be  '0=, 1=api, 2=collectors, 3=1, 4=2'
				
				More examples:
				https://localhost/api/collectors
				0=, 1=api, 2=collectors

				https://localhost/api
				0=, 1=api

				https://localhost/api/
				0=, 1=api, 2=
			*/

			if(uriArray.length < 3 || uriArray[2] === undefined || uriArray[2] == '')
				return res.status(400).json({'message':'What a such bad request...'});


			//Lets get the position 1 and 2 always.
			finalRoute = '/'+uriArray[1]+'/'+uriArray[2];

			logger.debug('Searching on authorization table for this uri: ' + finalRoute);

			var requestInfo = {
				clientId: req.user.clientId,
				route: finalRoute,
				methodName: req.method
			};

			routerAccessDao.getAccess(requestInfo, function(err, result){

                if(err) {
                	logger.error("setAuthorization routerAccessDao ");
                	return res.status(500).json({'message' : "INTERNAL ERROR"});
				}

                if(result){
                	//ACCESS GRANTED.
                    next();
                }else{
                    res.status(403).json({'message' : 'Get out dog.'});
                }
       		});			
			
		}
	);
}

var setRouteUsers = function(){
	// api/users
	var route = '/users';
	routes.register('/api' + route, 'GET');

	router.get(route, 
		function(req, res, next){
			//VALIDATION OF THE REQUEST

			logger.debug('validateUsersGet');

			next();
		},
		function(req, res){
	  		//PROCESS REQUEST

	  		//find all users.

			userDao.getAll(function(err, users){
	  		if(err)
	  			return res.json(err)

	  		res.json(users);

			});
		}
	);

	routes.register('/api' + route, 'POST');
	router.post(route, function(req, res){
	  	//insert user;

			var user = new User();
			user.username = req.body.username;
			user.password = req.body.password;
			user.name = req.body.name;
			user.email = req.body.email;

			userDao.insert(user, function(err, id){
				if(err)
		  			return res.json(err)

		  		user.id = id;
		  		res.json(user);
			});

		});

}

var setRouteAppClients = function (){

	var route = '/clients';

	routes.register('/api' + route, 'GET');
	router.get(route, function(req, res){
		//find all users;
		logger.info("Connection from client " + req.user.clientName);
		appClientDao.getAll(function(err, appClient){
			if(err)
				return res.status(500).json(err)

			res.json(appClient);
		});
	});

	routes.register('/api' + route, 'POST');
	router.post(route, function(req, res){
		//insert client;
		var client = new AppClient();

		logger.info(JSON.stringify(req.body, null, "\t"));

		client.clientName = req.body.clientName;
		client.authSecret = req.body.authSecret;
		
		//The description is not required. it's optional
		if(req.body.description)
			client.description = req.body.description;
		
		appClientDao.insert(client, function(err, clientId){
			if(err)
				return res.json({error: "Could not save app client user"});

			var random = require('../utils/baseutils').randomChars;

			// Create a new access token
			var token = new AccessToken();
			token.value = random.uid(16);
			token.appClientId = clientId;

			var tokenDao = new AccessTokenDao();
			tokenDao.insert(token, function(err, tokenId){
	
				if(err) return res.json({error: "could not create an access token"});
				
				client.id = clientId;
				client.token = token.value;
				res.json(client);
			});
		});
	});

	routes.register('/api' + route, 'DELETE');
	router.delete(route, function(req, res){

		var client = new AppClient();
		appClientDao.deleteByNameAndId(req.query.clientName, req.query.id, function(err, result){

			if(err) {
				return res.json({error: "Not able to remove client"});
			}

			res.json({message: "User successfuly removed!"});
		});
	});

}

var setRouteCollectors = function(){
	var dbRoute = '/api/collectors';
	var expressRouteSimple = '/collectors';
	var expressRouteId = expressRouteSimple + '/:id';

	routes.register(dbRoute, 'GET');

	router.get(expressRouteSimple, function(req, res){
		collectorDao.findAll(null, null, function(err, collectors){
			if(err)
				return res.status(500).json({'error' : err.toString()}); 

			return res.status(200).json({'result' : collectors});
		});
	});

	router.get(expressRouteId, function(req, res){

		if(!req.params.id || isNaN(req.params.id)){
			var validationError = {'object' : 'collector', 'action' : 'find by id'};
			validationError.errorMessage = 'id not a number';
			return res.status(400).json(validationError);
		}

		collectorDao.findById(req.params.id, function(err, collector){
			if(err)
				return res.status(500).json({'error' : err.toString()}); 

			return res.status(200).json({'result' : collector});
		});
	});

	var validateCollectorsPost = function(obj, callback){

		logger.debug('Validating json body: ' + JSON.stringify(obj));
		var validationError = {'object' : 'collector', 'action' : 'inserting'};

		if (Object.keys(obj).length === 0){
			validationError.errorMessage = 'Empty object';
		}else if(obj.id){
			validationError.errorMessage = 'id attribute found. should not contain it.';
		}else if(!obj.groupId || isNaN(obj.groupId) ){
			validationError.errorMessage = 'groupId not found or not a number';
		}else if(!obj.lat){
			validationError.errorMessage = 'lat not found.';
		}else if(!obj.lng){
			validationError.errorMessage = 'lng not found.';
		}else if(!obj.mac){
			validationError.errorMessage = 'mac not found.';
		}else if(!obj.name){
			validationError.errorMessage = 'name not found.';
		}else if(!obj.status){
			validationError.errorMessage = 'status not found.';
		}else if(!obj.description){
			validationError.errorMessage = 'description not found.';
		}

		if(validationError.errorMessage)
			return callback(validationError, null);

		callback(null, new Collector(obj));
	}

	routes.register(dbRoute, 'POST');
	router.post(expressRouteSimple, function(req, res){
		
		validateCollectorsPost(req.body, function(err, collector){
			if(err)
				return res.status(400).json(err);		

			collectorDao.insert(collector, function(err, id){
				if(err)
					return res.status(500).json({'error' : err.toString()}); 

				return res.status(200).json({'id' : id});
			});	
		});		
	});

	var validateCollectorsPut = function(obj, callback){

		logger.debug('Validating json body: ' + JSON.stringify(obj));
		var validationError = {'object' : 'collector', 'action' : 'updating'};

		if (Object.keys(obj).length === 0){
			validationError.errorMessage = 'Empty object';
		}else if(!obj.id || isNaN(obj.id) ){
			validationError.errorMessage = 'id not found or not a number';
		}else if(!obj.groupId || isNaN(obj.groupId) ){
			validationError.errorMessage = 'groupId not found or not a number';
		}else if(!obj.lat){
			validationError.errorMessage = 'lat not found.';
		}else if(!obj.lng){
			validationError.errorMessage = 'lng not found.';
		}else if(!obj.mac){
			validationError.errorMessage = 'mac not found.';
		}else if(!obj.name){
			validationError.errorMessage = 'name not found.';
		}else if(!obj.status){
			validationError.errorMessage = 'status not found.';
		}else if(!obj.description){
			validationError.errorMessage = 'description not found.';
		}

		if(validationError.errorMessage)
			return callback(validationError, null);

		callback(null, new Collector(obj));
	}

	routes.register(dbRoute, 'PUT');
	router.put(expressRouteSimple, function(req, res){

		validateCollectorsPut(req.body, function(err, collector){
			if(err)
				return res.status(400).json(err);		

			collectorDao.updateCollector(collector, function(err, rowCount){
				if(err)
					return res.status(500).json({'error' : err.toString()});

				if(rowCount > 0)
					return res.status(200).json({'message' : "updated count " + rowCount});

				return res.status(200).json({'error' : "The update didn't accur. The given ID doesn't exist on database."});
			});
		});			
	});

	routes.register(dbRoute, 'DELETE');
	router.delete(expressRouteId, function(req, res){

		if(!req.params.id || isNaN(req.params.id)){
			var validationError = {'object' : 'collector', 'action' : 'find by id'};
			validationError.errorMessage = 'id parameter not informed or not a number';
			return res.status(400).json(validationError);
		}

		collectorDao.deleteById(req.params.id, function(err, rowCount){
			if(err)
				return res.status(500).json({'error' : err}); 

			if(rowCount > 0)
				return res.status(200).json({'message' : "deleted count " + rowCount});

			return res.status(200).json({'error' : "The delete didn't accur. The given ID doesn't exist on database."});
		});
	});
}

var setRouteGroups = function(){
	var dbRoute = '/api/groups';
	var expressRouteSimple = '/groups';
	var expressRouteId = expressRouteSimple + '/:id';

	routes.register(dbRoute, 'GET');

	router.get(expressRouteSimple, function(req, res){
		groupDao.findAll(null, null, function(err, groups){
			if(err)
				return res.status(500).json({'error' : err.toString()}); 

			return res.status(200).json({'result' : groups});
		});		
	});
	router.get(expressRouteId, function(req, res){
		res.status(501).json({"message" : "This is not implemented yet. Come back in few years. Cya."});		
	});

	routes.register(dbRoute, 'POST');

	router.post(expressRouteSimple, function(req, res){
		res.status(501).json({"message" : "This is not implemented yet. Come back in few years. Cya."});		
	});

	routes.register(dbRoute, 'PUT');

	router.put(expressRouteId, function(req, res){
		res.status(501).json({"message" : "This is not implemented yet. Come back in few years. Cya."});
	});

	routes.register(dbRoute, 'DELETE');
	
	router.delete(expressRouteId, function(req, res){
		res.status(501).json({"message" : "This is not implemented yet. Come back in few years. Cya."});
	});
}

var setRouteRfiddata = function(){
	var dbRoute = '/api/rfiddata';
	var expressRouteSimple = '/rfiddata';
	var expressRouteId = expressRouteSimple + '/:id';

	routes.register(dbRoute, 'GET');

	router.get(expressRouteSimple, function(req, res){
		res.status(501).json({"message" : "This is not implemented yet. Come back in few years. Cya."});		
	});
	router.get(expressRouteId, function(req, res){
		res.status(501).json({"message" : "This is not implemented yet. Come back in few years. Cya."});		
	});

	routes.register(dbRoute, 'POST');

	router.post(expressRouteSimple, function(req, res){
		res.status(501).json({"message" : "This is not implemented yet. Come back in few years. Cya."});		
	});

	routes.register(dbRoute, 'PUT');

	router.put(expressRouteId, function(req, res){
		res.status(501).json({"message" : "This is not implemented yet. Come back in few years. Cya."});
	});

	routes.register(dbRoute, 'DELETE');
	
	router.delete(expressRouteId, function(req, res){
		res.status(501).json({"message" : "This is not implemented yet. Come back in few years. Cya."});
	});
}

var setRoutePermissions = function(){
	var dbRoute = '/api/permissions';
	var expressRouteSimple = '/permissions';
	var expressRouteId = expressRouteSimple + '/:id';

	routes.register(dbRoute, 'GET');

	router.get(expressRouteSimple, function(req, res){
		res.status(501).json({"message" : "This is not implemented yet. Come back in few years. Cya."});		
	});

}

module.exports = PlatformRouter;