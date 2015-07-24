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

			if(!req._parsedOriginalUrl || !req._parsedOriginalUrl.pathname){
				logger.warn("_parsedOriginalUrl missing");
				return res.status(400).json({'error':'_parsedOriginalUrl missing'});
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
				return res.status(400).json({'error':'What a such bad request...'});


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
                	return res.status(500).json({'error' : "INTERNAL ERROR"});
				}

                if(result){
                	//ACCESS GRANTED.
                    next();
                }else{
                    res.status(403).json({'error' : 'Get out dog.'});
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
				return res.status(500).json({'error' : err.toString()}); 

			return res.status(200).json({'result' : users});

		});
	});
	router.get(expressRouteId,function(req, res){
		logger.warn("DEVELOPMENT ROUTE IN ACTION. SHOULD NOT BE AVAILABLE ON PRODUCTION." + dbRoute);
		userDao.findById(req.params.id, function(err, user){
			if(err)
				return res.status(500).json({'error' : err.toString()}); 

			return res.status(200).json({'result' : user});
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

		userDao.insert(new User(req.body), function(err, id){
			if(err)
				return res.status(500).json({'error' : err.toString()}); 

			return res.status(200).json({'id' : id});
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

	/**
	* @apiDefine CustomAccess Access defined by an Admin 
	*/

	/**
	* @api {get} /api/collectors Get array of Collectors
	* @apiVersion 0.0.1
	* @apiName GetCollectors
	* @apiGroup Collectors
	* @apiPermission CustomAccess
	*
	* @apiDescription Search on platform for Collectors that match the given restrictions. 
	*
	* @apiParam (Query) {String='ONLINE','OFFLINE'} testParam This is a mega test param.
	* @apiParam (Query) {Number={1-50}} limit=50 Defines the maximum number of register to return.
	* @apiParam (Query) {Number={1-50}} offset=0 Defines the offset of register result to return.
	*
	* @apiExample Example usage:
	* curl -i https://example.com/api/collectors
	*
	* @apiSuccess {Object[]} collector       List of user Collectors.
	* @apiSuccess {Number}   collector.id   ID of the Collector.
	* @apiSuccess {Number}   collector.groupId   Group ID of the Collector.
	* @apiSuccess {String}   collector.mac   MAC address of the Collector.
	* @apiSuccess {String}   collector.name   Name of the Collector.
	* @apiSuccess {String}   collector.description   Brief description of the Collector.
	* @apiSuccess {String}   collector.status   Status the Collector.
	* @apiSuccess {String}   collector.lat   Geolocation of the Collector - Latitude.
	* @apiSuccess {String}   collector.lng   Geolocation of the Collector - Longitude.
	*
	* @apiError Unauthorized The client is not authenticated and can't use the API.
	* @apiError Forbidden The client is authenticated but has not authorization to the requested resource.
	*
	* @apiErrorExample String UnauthorizedError:
	*     HTTP/1.1 401 Unauthorized
	*		"Unauthorized"
	*
	* @apiErrorExample json ForbiddenError:
	*     HTTP/1.1 403 Forbidden
	*		{
	*			"error" : "Get out dog..."
	*		}
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
			return res.status(400).json(errors);

		collectorDao.findAll(limit, offset, function(err, collectors){
			if(err)
				return res.status(500).json({'error' : err.toString()}); 

			return res.status(200).json({'result' : collectors});
		});
	});

	router.get(expressRouteId, function(req, res){

		req.checkParams('id', 'missing or invalid').isInt();

		var errors = req.validationErrors();
		if(errors)
			return res.status(400).json(errors);

		collectorDao.findById(req.params.id, function(err, collector){
			if(err)
				return res.status(500).json({'error' : err.toString()}); 

			return res.status(200).json({'result' : collector});
		});
	});

	/**
	* @api {post} /api/collectors Insert Collectors
	* @apiVersion 0.0.1
	* @apiName PostCollectors
	* @apiGroup Collectors
	* @apiPermission CustomAccess
	*
	* @apiDescription Insert a new Collector. 
	*
	* @apiParam (Body) {Object} collector Collector object to be inserted.
	* @apiParam (Body) {Number={1-50}} collector.groupId Group ID the collector is related.
	* @apiParam (Query) {Number={1-50}} offset=0 Defines the offset of register result to return.
	*
	* @apiExample Example usage:
	* curl -i https://example.com/api/collectors
	*
	* @apiSuccess {Object[]} collector       List of user Collectors.
	* @apiSuccess {Number}   collector.id   ID of the Collector.
	* @apiSuccess {Number}   collector.groupId   Group ID of the Collector.
	* @apiSuccess {String}   collector.mac   MAC address of the Collector.
	* @apiSuccess {String}   collector.name   Name of the Collector.
	* @apiSuccess {String}   collector.description   Brief description of the Collector.
	* @apiSuccess {String}   collector.status   Status the Collector.
	* @apiSuccess {String}   collector.lat   Geolocation of the Collector - Latitude.
	* @apiSuccess {String}   collector.lng   Geolocation of the Collector - Longitude.
	*
	* @apiError Unauthorized The client is not authenticated and can't use the API.
	* @apiError Forbidden The client is authenticated but has not authorization to the requested resource.
	*
	* @apiErrorExample String UnauthorizedError:
	*     HTTP/1.1 401 Unauthorized
	*		"Unauthorized"
	*
	* @apiErrorExample json ForbiddenError:
	*     HTTP/1.1 403 Forbidden
	*		{
	*			"error" : "Get out dog..."
	*		}
	*/

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
			return res.status(400).json(errors);		

		collectorDao.insert(new Collector(req.body), function(err, id){
			if(err)
				return res.status(500).json({'error' : err.toString()}); 

			return res.status(200).json({'id' : id});
		});	
	});

	routes.register(dbRoute, routes.getMethods().PUT);
	router.put(expressRouteSimple, function(req, res){

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
			return res.status(400).json(errors);		

		collectorDao.updateCollector(new Collector(req.body), function(err, rowCount){
			if(err)
				return res.status(500).json({'error' : err.toString()});

			if(rowCount > 0)
				return res.status(200).json({'message' : "updated count " + rowCount});

			return res.status(200).json({'error' : "The update didn't accur. The given ID doesn't exist on database."});
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
				return res.status(500).json({'error' : err.toString()}); 

			return res.status(200).json({'result' : groups});
		});		
	});

	router.get(expressRouteId, function(req, res){
		req.checkParams('id', 'missing or invalid').isInt();

		var errors = req.validationErrors();
		if(errors)
			return res.status(400).json(errors);

		groupDao.findById(req.params.id, function(err, group){
			if(err)
				return res.status(500).json({'error' : err.toString()}); 

			return res.status(200).json({'result' : group});
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

		var errors = req.validationErrors();
		
		if(errors)
			return res.status(400).json(errors);		

		groupDao.insert(new Group(req.body), function(err, id){
			if(err)
				return res.status(500).json({'error' : err.toString()}); 

			return res.status(200).json({'id' : id});
		});			
	});

	routes.register(dbRoute, routes.getMethods().PUT);

	router.put(expressRouteId, function(req, res){
		
		req.checkBody('id', 'missing or invalid int.').isInt();
		req.checkBody('name', 'missing.').notEmpty();
		req.checkBody('creationDate', 'missing  or invalid date.').isDate();
		req.checkBody('description', 'missing.').notEmpty();
		req.checkBody('isDefault', 'missing or invalid boolean.').isBoolean();

		req.sanitizeBody('name').toString();
		req.sanitizeBody('description').toString();

		var errors = req.validationErrors();

		if(errors)
			return res.status(400).json(errors);		

		groupDao.updateGroup(new Group(req.body), function(err, rowCount){
			if(err)
				return res.status(500).json({'error' : err.toString()});

			if(rowCount > 0)
				return res.status(200).json({'message' : "updated count " + rowCount});

			return res.status(200).json({'error' : "The update didn't accur. The given ID doesn't exist on database."});
		});
	});

	routes.register(dbRoute, routes.getMethods().DELETE);
	
	router.delete(expressRouteId, function(req, res){
		req.checkParams('id', 'missing or not a integer').isInt();

		var errors = req.validationErrors();
		if(errors)
			return res.status(400).json(errors);

		groupDao.deleteById(req.params.id, function(err, rowCount){
			if(err)
				return res.status(500).json({'error' : err}); 

			if(rowCount > 0)
				return res.status(200).json({'message' : "deleted count " + rowCount});

			return res.status(200).json({'error' : "The delete didn't accur. The given ID doesn't exist on database."});
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

		logger.warn(dbRoute + "GET : Cound generate offset db error if bigger than rows available?");

		rfiddataDao.findAll(limit, offset, function(err, rfiddatas){
			if(err)
				return res.status(500).json({'error' : err.toString()}); 

			return res.status(200).json({'result' : rfiddatas});
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
			return res.status(400).json(errors);

		rfiddataDao.findByRfidcode(req.params.rfidcode, limit, offset, function(err, rfiddatas){
			if(err)
				return res.status(500).json({'error' : err.toString()}); 

			return res.status(200).json({'result' : rfiddatas});
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
			return res.status(401).json({"error" : "Where is your token sir? How have you got here? Better you start running..."});

		var array = req.headers.authorization.split(' ');

		var token = null;

		if(array[0] && array[0] == 'Bearer' && array[1]){
			token = array[1];
		}else{
			return res.status(401).json({"error" : "What a mess with your token sir. How have you got here? Better you start running..."});
		}

		permissions.findByToken(token, function(err, permissions){
			if(err)
				return res.status(500).json({'error' : err.toString()}); 

			return res.status(200).json({'result' : permissions});				
		});	
	});

}

module.exports = PlatformRouter;