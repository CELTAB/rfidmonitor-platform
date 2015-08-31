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

var Rfiddata = require('../models/rfiddata');
var RfiddataDao = require('../dao/rfiddatadao');

var routes = require('../utils/routes');
var permissions = require('../utils/permissions');



var PlatformRouter = function(){

	router = express.Router();
	userDao = new UserDao();
	appClientDao = new AppClientDao();
	accessTokenDao = new AccessTokenDao();
	routerAccessDao = new RouterAccessDao();
	collectorDao = new CollectorDao();
	groupDao = new GroupDao();
	rfiddataDao = new RfiddataDao();

	passport.use('api-bearer', new BearerStrategy({}, validateBearer));
	setAuthorization();

	setRouteUsers();
	// setRouteAppClients();
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

			if(!req.originalUrl){
				logger.warn("originalUrl missing");
				return res.status(400).send({'message':'originalUrl missing'});
			}
			
			var uriArray = req.originalUrl.split('/');

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
				return res.status(400).send({'message':'What a such bad request...'});


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
                	return res.status(500).send({'message' : "INTERNAL ERROR"});
				}

                if(result){
                	//ACCESS GRANTED.
                    next();
                }else{
                    res.status(403).send({'message' : 'Get out dog.'});
                }
       		});			
			
		}
	);
}

var setRouteUsers = function(){

	var dbRoute = '/api/users';
	var expressRouteSimple = '/users';
	var expressRouteId = expressRouteSimple + '/:id';

	logger.warn("DEVELOPMENT ROUTE IN ACTION. SHOULD NOT BE AVAILABLE ON PRODUCTION." + dbRoute);

	/* OBJECT EXAMPLE
	{
		"username" : "jaime",
		"password" : "ab#5",
		"name" : "jaime bomber man",
		"email" : "jaime@jaime.com"
	}
	*/

	routes.register(dbRoute, routes.getMethods().GET);

	router.get(expressRouteSimple,function(req, res){
		logger.warn("DEVELOPMENT ROUTE IN ACTION. SHOULD NOT BE AVAILABLE ON PRODUCTION." + dbRoute);
		userDao.getAll(function(err, users){
			if(err)
				return res.status(500).send({'message' : err.toString()}); 

			return res.status(200).send(users);

		});
	});
	router.get(expressRouteId,function(req, res){
		logger.warn("DEVELOPMENT ROUTE IN ACTION. SHOULD NOT BE AVAILABLE ON PRODUCTION." + dbRoute);
		userDao.findById(req.params.id, function(err, user){
			if(err)
				return res.status(500).send({'message' : err.toString()}); 

			return res.status(200).send(user);
		});

	});

	routes.register(dbRoute, routes.getMethods().POST);
	router.post(expressRouteSimple, function(req, res){
		logger.warn("DEVELOPMENT ROUTE IN ACTION. SHOULD NOT BE AVAILABLE ON PRODUCTION." + dbRoute);

		req.checkBody('username', 'missing or invalid').isAlphanumeric();
		req.checkBody('password', 'missing or invalid').notEmpty();
		req.checkBody('password', 'too short').isLength(3);
		req.checkBody('name', 'missing').notEmpty();
		req.checkBody('email', 'missing or invalid').isEmail();

		var errors = req.validationErrors();

		if(errors)
			return res.status(400).json(erros);

		var user = new User(req.body);
		userDao.insert(user, function(err, id){
			if(err)
				return res.status(500).send({'message' : err.toString()}); 

			user.id = id;
			return res.status(200).send(user);
		});

	});

}

var setRouteAppClients = function (){

	// var route = '/clients';

	// /* OBJECT EXAMPLE
	// {
	// 	"username" : "jaime",
	// 	"password" : "ab#5",
	// 	"name" : "jaime bomber man",
	// 	"email" : "jaime@jaime.com"
	// }
	// */

	// routes.register('/api' + route, routes.getMethods().GET);
	// router.get(route, function(req, res){
	// 	//find all users;
	// 	logger.info("Connection from client " + req.user.clientName);
	// 	appClientDao.getAll(function(err, appClient){
	// 		if(err)
	// 			return res.status(500).json(err)

	// 		res.json(appClient);
	// 	});
	// });

	// routes.register('/api' + route, routes.getMethods().POST);
	// router.post(route, function(req, res){
	// 	//insert client;
	// 	var client = new AppClient();

	// 	logger.info(JSON.stringify(req.body, null, "\t"));

	// 	client.clientName = req.body.clientName;
	// 	client.authSecret = req.body.authSecret;
		
	// 	//The description is not required. it's optional
	// 	if(req.body.description)
	// 		client.description = req.body.description;
		
	// 	appClientDao.insert(client, function(err, clientId){
	// 		if(err)
	// 			return res.json({error: "Could not save app client user"});

	// 		var random = require('../utils/baseutils').randomChars;

	// 		// Create a new access token
	// 		var token = new AccessToken();
	// 		token.value = random.uid(16);
	// 		token.appClientId = clientId;

	// 		var tokenDao = new AccessTokenDao();
	// 		tokenDao.insert(token, function(err, tokenId){
	
	// 			if(err) return res.json({error: "could not create an access token"});
				
	// 			client.id = clientId;
	// 			client.token = token.value;
	// 			res.json(client);
	// 		});
	// 	});
	// });

	// routes.register('/api' + route, routes.getMethods().DELETE);
	// router.delete(route, function(req, res){

	// 	var client = new AppClient();
	// 	appClientDao.deleteByNameAndId(req.query.clientName, req.query.id, function(err, result){

	// 		if(err) {
	// 			return res.json({error: "Not able to remove client"});
	// 		}

	// 		res.json({message: "User successfuly removed!"});
	// 	});
	// });

}

var setRouteCollectors = function(){
	var dbRoute = '/api/collectors';
	var expressRouteSimple = '/collectors';
	var expressRouteId = expressRouteSimple + '/:id';

	/* OBJECT EXAMPLE
	{
	"id":"1",
	"groupId":"1",
	"lat":"a1",
	"lng":"a",
	"mac":"AA:AA:11:AA:AA:aa",
	"name":"a",
	"status":"ONLINE",
	"description":"a"
	}
	*/

	

	routes.register(dbRoute, routes.getMethods().GET);

	router.get(expressRouteSimple, function(req, res){
		var limit = null;
		var offset = null;
		if(req.query.limit){
			limit = req.query.limit;
			req.checkQuery('limit', 'invalid or out of boundaries').isInt({ min: 1, max: 50});
		}
		if(req.query.offset){
			offset = req.query.offset;
			req.checkQuery('offset', 'invalid or out of boundaries').isInt({ min: 1, max: 50});
		}

		logger.warn(dbRoute + "GET : Cound generate offset db error if bigger than rows available?");

		var errors = req.validationErrors();
		if (errors)
			return res.status(400).send(errors);

		collectorDao.findAll(limit, offset, function(err, collectors){
			if(err)
				return res.status(500).send(err.toString()); 

			return res.status(200).send(collectors);
		});
	});

	

	router.get(expressRouteId, function(req, res){

		req.checkParams('id', 'missing or invalid').isInt();

		var errors = req.validationErrors();
		if(errors)
			return res.status(400).json(errors);

		collectorDao.findById(req.params.id, function(err, collector){
			if(err)
				return res.status(500).send(err.toString()); 

			return res.status(200).send(collector);
		});
	});

	

	routes.register(dbRoute, routes.getMethods().POST);
	router.post(expressRouteSimple, function(req, res){

		req.checkBody('id', 'should not be defined.').isNull();
		req.checkBody('groupId', 'missing or not a integer.').isInt();
		req.checkBody('lat', 'missing.').notEmpty();
		req.checkBody('lng', 'missing.').notEmpty();
		req.checkBody('mac', 'missing or not a valid mac address.').isMac();
		req.checkBody('name', 'missing.').notEmpty();
		req.checkBody('status', 'missing or invalid status.').isCollectorStatus();
		req.checkBody('description', 'missing.').notEmpty();

		req.sanitizeBody('lat').trim();
		req.sanitizeBody('lng').trim();
		req.sanitizeBody('mac').toString();
		req.sanitizeBody('name').toString();
		req.sanitizeBody('description').toString();

		var errors = req.validationErrors();
		
		if(errors)
			return res.status(400).send(errors);		

		var collector = new Collector(req.body)
		collectorDao.insert(collector, function(err, id){
			if(err)
				return res.status(500).send(err.toString()); 

			collector.id = id;
			return res.status(200).send(collector);
		});	
	});
	

	routes.register(dbRoute, routes.getMethods().PUT);
	router.put(expressRouteId, function(req, res){

		req.checkParams('id', 'missing or not a integer.').isInt();

		req.checkBody('id', 'missing or not a integer.').isInt();
		req.checkBody('groupId', 'missing or not a integer.').isInt();
		req.checkBody('lat', 'missing.').notEmpty();
		req.checkBody('lng', 'missing.').notEmpty();
		req.checkBody('mac', 'missing or not a valid mac address.').isMac();
		req.checkBody('name', 'missing.').notEmpty();
		req.checkBody('status', 'missing or a invalid status').isCollectorStatus();
		req.checkBody('description', 'missing.').notEmpty();

		req.sanitizeBody('lat').trim();
		req.sanitizeBody('lng').trim();
		req.sanitizeBody('mac').toString();
		req.sanitizeBody('name').toString();
		req.sanitizeBody('description').toString();

		var errors = req.validationErrors();

		if(errors)
			return res.status(400).send(errors);		

		var collector = new Collector(req.body);
		collectorDao.updateCollector(collector, function(err, rowCount){
			if(err)
				return res.status(500).send(err.toString());

			if(rowCount > 0){
				return res.status(200).send(collector);
			}

			return res.status(400).send({"message":"The update did not occur. The given ID doesn't exist on database."});
		});
	});

	

	routes.register(dbRoute, routes.getMethods().DELETE);
	router.delete(expressRouteId, function(req, res){

		req.checkParams('id', 'missing or not a integer').isInt();

		var errors = req.validationErrors();
		if(errors)
			return res.status(400).json(errors);

		collectorDao.deleteById(req.params.id, function(err, rowCount){
			if(err)
				return res.status(500).send(err.toString()); 

			if(rowCount > 0)
				return res.status(200).send();

			return res.status(400).send({"message":"The delete didn't accur. The given ID doesn't exist on database."});
		});
	});
}

var setRouteGroups = function(){
	var dbRoute = '/api/groups';
	var expressRouteSimple = '/groups';
	var expressRouteId = expressRouteSimple + '/:id';

	/*
	{ OBJECT EXAMPLE
		"id" = 0;
		"name" = "fsfsdfd";
		"creationDate" = "probably error here";
	    "description" = "sadfasfsa";
	    "isDefault" = null;
	}
	*/

	routes.register(dbRoute, routes.getMethods().GET);

	router.get(expressRouteSimple, function(req, res){
		var limit = null;
		var offset = null;
		if(req.query.limit){
			limit = req.query.limit;
			req.checkQuery('limit', 'invalid or out of boundaries').isInt({ min: 1, max: 50});
		}
		if(req.query.offset){
			offset = req.query.offset;
			req.checkQuery('offset', 'invalid or out of boundaries').isInt({ min: 1, max: 50});
		}

		logger.warn(dbRoute + "GET : Cound generate offset db error if bigger than rows available?");

		groupDao.findAll(limit, offset, function(err, groups){
			if(err)
				return res.status(500).send(err.toString()); 

			return res.status(200).send(groups);
		});		
	});

	router.get(expressRouteId, function(req, res){
		req.checkParams('id', 'missing or invalid').isInt();

		var errors = req.validationErrors();
		if(errors)
			return res.status(400).send(errors);

		groupDao.findById(req.params.id, function(err, group){
			if(err)
				return res.status(500).send(err.toString()); 

			return res.status(200).send(group);
		});	
	});

	routes.register(dbRoute, routes.getMethods().POST);

	router.post(expressRouteSimple, function(req, res){

		req.checkBody('id', 'missing or invalid int.').isInt();
		req.checkBody('name', 'missing.').notEmpty();
		req.checkBody('creationDate', 'missing  or invalid date.').isDate();
		req.checkBody('description', 'missing.').notEmpty();
		req.checkBody('isDefault', 'missing or invalid boolean.').isBoolean();

		req.sanitizeBody('name').toString();
		req.sanitizeBody('description').toString();
		req.sanitizeBody('isDefault').toBoolean();

		var errors = req.validationErrors();
		
		if(errors)
			return res.status(400).json(errors);		

		var group = new Group(req.body);
		groupDao.insert(group, function(err, id){
			if(err)
				return res.status(500).send(err.toString()); 

			group.id = id;
			return res.status(200).send(group);
		});			
	});

	routes.register(dbRoute, routes.getMethods().PUT);

	router.put(expressRouteId, function(req, res){
		
		req.checkParams('id', 'missing or invalid int.').isInt();

		req.checkBody('id', 'missing or invalid int.').isInt();
		req.checkBody('name', 'missing.').notEmpty();
		req.checkBody('creationDate', 'missing  or invalid date.').isDate();
		req.checkBody('description', 'missing.').notEmpty();
		req.checkBody('isDefault', 'missing or invalid boolean.').isBoolean();

		req.sanitizeBody('name').toString();
		req.sanitizeBody('description').toString();
		req.sanitizeBody('isDefault').toBoolean();

		var errors = req.validationErrors();

		if(errors)
			return res.status(400).send(errors);		

		var group = new Group(req.body);
		groupDao.updateGroup(group, function(err, rowCount){
			if(err)
				return res.status(500).send(err.toString());

			if(rowCount > 0)
				return res.status(200).send();

			return res.status(400).send({"message": "The update didn't occur. The given ID doesn't exist on database."});
		});
	});

	routes.register(dbRoute, routes.getMethods().DELETE);
	
	router.delete(expressRouteId, function(req, res){
		req.checkParams('id', 'missing or not a integer').isInt();

		var errors = req.validationErrors();
		if(errors)
			return res.status(400).send(errors);

		groupDao.deleteById(req.params.id, function(err, rowCount){
			if(err)
				return res.status(500).send(err.toStrin()); 

			if(rowCount > 0)
				return res.status(200).send();

			return res.status(400).send({"message" : "The delete didn't occur. The given ID doesn't exist on database."});
		});
	});
}

var setRouteRfiddata = function(){
	var dbRoute = '/api/rfiddata';
	var expressRouteSimple = '/rfiddata';
	var expressRouteId = expressRouteSimple + '/:rfidcode';

	/* OBJECT EXAMPLE
	    "id" = 0;
	    "rfidReadDate" = "error here";
	    "serverReceivedDate" = "error here";
	    "rfidcode" = 23423423;
	    "collectorId" = 1;
		"packageId" = 1;
	    "extraData" = "{}";
	*/

	routes.register(dbRoute, routes.getMethods().GET);

	router.get(expressRouteSimple, function(req, res){
		var limit = null;
		var offset = null;
		if(req.query.limit){
			limit = req.query.limit;
			req.checkQuery('limit', 'invalid or out of boundaries').isInt({ min: 1, max: 50});
		}
		if(req.query.offset){
			offset = req.query.offset;
			req.checkQuery('offset', 'invalid or out of boundaries').isInt({ min: 1, max: 50});
		}

		// logger.warn(dbRoute + "GET : Cound generate offset db error if bigger than rows available?");

		rfiddataDao.findAll(limit, offset, function(err, rfiddatas){
			if(err)
				return res.status(500).send({"message" : err.toString()}); 

			return res.status(200).json(rfiddatas);
		});			
	});

	router.get(expressRouteId, function(req, res){
		req.checkParams('rfidcode', 'missing or invalid').isInt();

		var limit = null;
		var offset = null;
		
		if(req.query.limit){
			limit = req.query.limit;
			req.checkQuery('limit', 'invalid or out of boundaries').isInt({ min: 1, max: 50});
		}
		if(req.query.offset){
			offset = req.query.offset;
			req.checkQuery('offset', 'invalid or out of boundaries').isInt({ min: 1, max: 50});
		}

		var errors = req.validationErrors();
		if(errors)
			return res.status(400).send(errors);

		rfiddataDao.findByRfidcode(req.params.rfidcode, limit, offset, function(err, rfiddatas){
			if(err)
				return res.status(500).send({"message" : err.toString()}); 

			return res.status(200).send(rfiddatas);
		});		
	});
}

var setRoutePermissions = function(){
	var dbRoute = '/api/permissions';
	var expressRouteSimple = '/permissions';
	var expressRouteId = expressRouteSimple + '/:token';

	routes.register(dbRoute, routes.getMethods().GET);

	router.get(expressRouteSimple, function(req, res){
		if(!req.headers.authorization)
			return res.status(401).send({"message" : "Where is your token sir? How have you got here? Better you start running..."});

		var array = req.headers.authorization.split(' ');

		var token = null;

		if(array[0] && array[0] == 'Bearer' && array[1]){
			token = array[1];
		}else{
			return res.status(401).send({"message" : "What a mess with your token sir. How have you got here? Better you start running..."});
		}

		permissions.findByToken(token, function(err, permissions){
			if(err)
				return res.status(500).send({"message" : err.toString()}); 

			return res.status(200).send(permissions);				
		});	
	});
}

module.exports = PlatformRouter;