var express = require('express');
var fs = require('fs');
var path = require('path');

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

var multer  = require('multer');
var upload = multer({ dest: 'restricted_media/tmp/' });

var appDir = path.dirname(require.main.filename);

var SeqUser = require('../models/sequser');
var SeqAccessToken = require('../models/seqaccesstoken');	
var SeqAppClient = require('../models/seqappclient');
var SeqUriRoute = require('../models/sequriroute');
var SeqRouteAccess = require('../models/seqrouteaccess');

var sequelize = require('../dao/platformsequelize');

	SeqUser.sync();
	SeqUriRoute.sync(); // TODO <- GAMBI quem garante que sincronizará a tempo antes de alguem tentar usar.
	SeqRouteAccess.sync(); // TODO <- GAMBI quem garante que sincronizará a tempo antes de alguem tentar usar.

	SeqAppClient.sync().then(function(){

		SeqAccessToken.sync().then(function(){

			//TMP CODE

			logger.warn('Is expected to receive the follow error from sequelize: "SequelizeUniqueConstraintError: Validation error". The reason is unkown.');

			//TODO we should use findorcreated instead. but it is not working.
			SeqAppClient.create({id: 1, clientName: "DEFAULT", authSecret : "DEFAULT", description : "DEFAULT"})
			.then(function(client){
				SeqAccessToken.create({value: "defaulttokenaccess", appClient : client.id})
				.then(function(){
					logger.debug('default token created.');


				})
				.catch(function(e){
					logger.error('SeqAccessToken.create error : ' + e);
				});


				SeqUriRoute.findOne({where : {path : 'ANY', method : 'ANY'}}).then(function(rec){
					if(rec){
						SeqRouteAccess
						.findOrCreate({where: {appClient: 1}, defaults: {uriRoute: rec.id}})
	  					.spread(function(accessroute, created) {
	  						if(created){
	  							logger.debug('ROUTE ACCESS TO ANY-ANY AND USER ID 1 HAS BEEN CREATED');
	  						}
	  					});
					}
				});
			})
			.catch(function(e){
				logger.error('SeqAppClient.create error : ' + e);
			});


			 //END OF TMP CODE

		});
	});


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
	setRouteManualImport();

	return router;
}

var validateBearer = function(token, done) {
	logger.debug('validateBearer');

	SeqAccessToken.findOne({where : { value : token }})
	.then(function(token){

		if (!token) { return done(null, false); }

		SeqAppClient.findOne({where : { id : token.appClient}})
		.then(function(client){

			if (!client) { return done(null, false); }

			logger.debug("BearerStrategy : SUCCESS");
            done(null, {clientId: client.id, clientName: client.clientName}, { scope: '*' });

		})
		.catch(function(e){
			return done(e);
		});

	})
	.catch(function(e){
		return done(e);
	});
}

var setAuthorization = function(){
	logger.warn('move setAuthorization to some generic place. This is being used by all routers not only this.');
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

			SeqRouteAccess.findOne(
				{
					where : { appClient: req.user.clientId}, 
					include: [
						{
		        			model: SeqUriRoute,
		        			where: { 
		        				path: { $or : ['ANY', finalRoute] }, 
		        				method : { $or : ['ANY', req.method] } 
		        			}
		    			}
		    		]
				}
		    )
			.then(function(access){
				if(access){
                	//ACCESS GRANTED.
                    next();
                }else{
                    res.status(403).send({'message' : 'Get out dog.'});
                }
			})
			.catch(function(e){
				return res.status(500).send({'message' : "INTERNAL ERROR : " + e});
			});		
			
		}
	);
}

var setRouteUsers = function(){

	var dbRoute = '/api/users';
	var expressRouteSimple = '/users';
	var expressRouteId = expressRouteSimple + '/:id';

	/* OBJECT EXAMPLE
	{
		"username" : "jaime",
		"password" : "ab#5",
		"name" : "jaime bomber man",
		"email" : "jaime@jaime.com",
		"loginAllowed": false
	}
	*/

	routes.register(dbRoute, routes.getMethods().GET);
	router.get(expressRouteSimple, function(req, res){

		/* Will no return the password filed and the deletedAt field 1*/
		SeqUser.findAll()
			.then(function(users){
				res.status(200).send(users);
			})
			.catch(function(e){
				return res.status(500).send({'message' : "INTERNAL ERROR : " + e});
		});		
	});

	router.get(expressRouteId, function(req, res){

		if(!req.params || !req.params.id){
			return res.status(400).send({message: "Missing User ID"});
		}

		/* Will no return the password filed and the deletedAt field 1*/
		SeqUser.findOne(
				{
					where: {
						id: req.params.id
					}
				}
		    )
			.then(function(user){
				if(user){
					res.status(200).send(user);
				}else{
					res.status(200).send({message: "User not found"});
				}
			})
			.catch(function(e){
				return res.status(500).send({'message' : "INTERNAL ERROR : " + e});
		});

	});

	routes.register(dbRoute, routes.getMethods().POST);
	router.post(expressRouteSimple, function(req, res){
		// req.checkBody('username', 'missing or invalid').isAlphanumeric();
		// req.checkBody('password', 'missing or invalid').notEmpty();
		// req.checkBody('password', 'too short').isLength(3);
		// req.checkBody('name', 'missing').notEmpty();
		// req.checkBody('email', 'missing or invalid').isEmail();

		// var errors = req.validationErrors();

		// if(errors)
		// 	return res.status(400).json(errors);

		try{

			var User = sequelize.model("User");

			User.findOne({where: {username: req.body.username}})
				.then(function(user){
					if(!user){
						User.create(req.body)
							.then(function(newUser){
								return res.status(200).send(newUser.clean());
							})
							.catch(function(err){
								return res.status(400).send({message: err});
							});
					}else{
						return res.status(400).send({mesage:"Username already in use"});
					}
			});

		}catch(err){
			logger.error("Error: " + err);
			return res.status(500).send({message: "INTERNAL ERROR : " + err});
		}
	});

	routes.register(dbRoute, routes.getMethods().PUT);
	router.put(expressRouteId, function(req, res){
		
		if(!req.params.id || !req.body.id)
			return res.status(400).send({message: "Missing param ID or body ID"});

		if(req.params.id != req.body.id)
			return res.status(400).send({message: "Divergent param ID & body ID"});

		try{

			var User = sequelize.model("User");

			User.findOne({where: {id: req.params.id}})
				.then(function(user){
					if(user){
						user.update(req.body)
							.then(function(upUser){

								if(upUser){
									return res.status(200).send(upUser.clean());

								}else{
									return res.status(500).send({message:"Could not update the user"});
								}

							}).catch(function(e){
								return res.status(400).send({message: "ERROR : " + e});	
							});
					}else{
						return res.status(400).send({mesage:"User not found"});
					}
			}).catch(function(e){
				return res.status(400).send({message: "ERROR : " + e});	
			});

		}catch(err){
			logger.error("Error: " + err);
			return res.status(500).send({message: "INTERNAL ERROR : " + err});
		}
	});

	routes.register(dbRoute, routes.getMethods().DELETE);
	router.delete(expressRouteId, function(req, res){
		
		if(!req.params.id)
			return res.status(400).send("Missing param ID");

		try{

			var User = sequelize.model("User");

			User.findOne({where: {id: req.params.id}})
				.then(function(user){
					if(user){
						user.destroy(req.body)
							.then(function(delUser){

								if(delUser){
									return res.status(200).send(delUser.clean());

								}else{
									return res.status(500).send({message:"Could not delete the user"});
								}

							}).catch(function(e){
								return res.status(400).send({message: "ERROR : " + e});	
							});
					}else{
						return res.status(400).send({mesage:"User not found"});
					}
			}).catch(function(e){
				return res.status(400).send({message: "ERROR : " + e});	
			});

		}catch(err){
			logger.error("Error: " + err);
			// logger.error('Model User not found');
			return res.status(500).send({message: "INTERNAL ERROR : " + err});
		}
	});
}


var setLoginRouters = function() {

	return;

	//This is not working. Need change logic. Don't touch it, please
	var dbRoute = '/api/users/login';
	var expressRouteSimple = '/users/login';
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

		return res.status(501).send({message: "Not implemented yet"});
		
	});


			//TODO: Login
		// logger.warn("DEVELOPMENT ROUTE IN ACTION. SHOULD NOT BE AVAILABLE ON PRODUCTION." + dbRoute);

		// if(!req.body.username || !req.body.password){
		// 	return res.status(400).send({'message': 'Missing username or password'});
		// }

		// logger.warn("Need to HASH the password");

		// SeqUser.findOne(
		// 		{
		// 			where : { 
		// 				username: req.body.username,
		// 				loginAllowed: true
		// 			}
		// 		}
		//     )
		// 	.then(function(user){
		// 		if(user){
                	
		// 			//TODO: Validade Password here.


  //               }else{
  //                   res.status(403).send({'message' : 'Get out dog.'});
  //               }
		// 	})
		// 	.catch(function(e){
		// 		return res.status(500).send({'message' : "INTERNAL ERROR : " + e});
		// 	});	




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

		// req.checkBody('id', 'missing or invalid int.').isInt();
		req.checkBody('name', 'missing.').notEmpty();
		// req.checkBody('creationDate', 'missing  or invalid date.').isDate();
		req.checkBody('description', 'missing.').notEmpty();
		// req.checkBody('isDefault', 'missing or invalid boolean.').isBoolean();

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

		logger.warn(dbRoute + "GET : Cound generate offset db error if bigger than rows available?");

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

var setRouteManualImport = function(){

	var dbRoute = '/api/import';
	var expressRouteSimple = '/import';

	routes.register(dbRoute, routes.getMethods().POST);

	router.post(expressRouteSimple, upload.single('import_file'), function(req, res){

		if(!req.file)
			return res.status(400).send("We didnt receive you file");
		
		var file = req.file;

		if(file.size > 500 * 1024 * 1024)
			return res.status(400).send("file bigger than 500mb");

		file.finalPath = appDir + '/restricted_media/media/manual_import/' + req.file.filename;

		fs.readFile(req.file.path, function (err, data) {
		    if (err){
		    	 return res.status(500).send("error read" + err);
		    }
		    
		    fs.writeFile(file.finalPath, data, function (err) {
		        if (err){
			    	 return res.status(500).send("error " + err);
			    }

			    var parsedData = null;
			    try{
			    	parsedData = JSON.parse(data);
			    }catch(e){
			    	return res.status(400).send("Parsing file error : " + e );
			    }

			    rfiddataDao.insertArray(parsedData, function(err, result){
					if (err){
						var error = "rfiddatadao router insert err : " + err;
						logger.error(error);
						res.status(500).send(error);
					}
					else{
						res.status(200).send(result);
					}
				});	        
		    });
		});		
	});

}

module.exports = PlatformRouter;