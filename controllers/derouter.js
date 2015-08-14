var express = require('express');
var logger = require('winston');
var BearerStrategy = require('passport-http-bearer').Strategy
var passport = require('passport');

var AppClient = require('../models/appclient');
var AppClientDao = require('../dao/appclientdao');

var AccessToken = require('../models/accesstoken');
var AccessTokenDao = require('../dao/accesstokendao');

var RouterAccess = require('../models/routeraccess');
var RouterAccessDao = require('../dao/routeraccessdao');

var routes = require('../utils/routes');
var DynamicEntities = require('./dynamicentities');
var deModelPool = require('./demodelpool');

var ClientEntitiesRaw = require('../models/orm/cliententitiesraw');

var DERouter = function(){

	router = express.Router();
	appClientDao = new AppClientDao();
	accessTokenDao = new AccessTokenDao();
	routerAccessDao = new RouterAccessDao();

	dynamicEntities = new DynamicEntities();

	passport.use('api-bearer', new BearerStrategy({}, validateBearer));
	setAuthorization();

	setRouteMetaInfo();
	setRouteRegisterEntity();
	setRouteDeDao();

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
			logger.warn("fix this on derouter");
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
                	logger.debug("ACCESS GRANTED.");
                    next();
                }else{
                    res.status(403).send({'message' : 'Get out dog.'});
                }
       		});			
			
		}
	);
}

var setRouteMetaInfo = function(){

	var dbRoute = '/api/de/meta';
	var expressRouteSimple = '/de/meta';
	var expressRouteId = expressRouteSimple + '/:entity';

	routes.register(dbRoute, routes.getMethods().GET);

	router.get(expressRouteSimple,function(req, res){

		ClientEntitiesRaw.findAll()
		.then(function(entities){
			return res.status(200).send(entities);
		})
		.catch(function(e){
			return res.status(500).send(e);
		});		

	});

	router.get(expressRouteId,function(req, res){

		ClientEntitiesRaw.findAll({where : { identifier : req.params.entity }})
		.then(function(entities){
			return res.status(200).send(entities);
		})
		.catch(function(e){
			return res.status(500).send(e);
		});	

	});
}

var setRouteRegisterEntity = function(){

	var dbRoute = '/api/de/register';
	var expressRouteSimple = '/de/register';
	var expressRouteId = expressRouteSimple + '/:entity';

	routes.register(dbRoute, routes.getMethods().POST);

	router.post(expressRouteSimple,function(req, res){

		dynamicEntities.registerEntity(req.body, function(errors){
			if(errors)
				return res.status(500).send(errors);	
			
			return res.status(200).send({"message" : "OK"});
		});


	});

}

var checkEntity = function(req, res, next){
	logger.debug("api/de/dao/ checking for valid model of " + req.params.entity);
	
	if(deModelPool.getModel(req.params.entity))
		return next();

	res.status(400).send("NOT A VALID ENTITY");
}

var setRouteDeDao = function(){

	//TODO specify new kind of authorization for dynamic routes.
	//Example: /api/de/dao/car , /api/de/dao/person/4

	var dbRoute = '/api/de/dao';
	var expressRouteSimple = '/de/dao/:entity';
	var expressRouteId = expressRouteSimple + '/:id';

	routes.register(dbRoute, routes.getMethods().GET);


	router.get(expressRouteSimple, checkEntity, function(req, res){

		var model = deModelPool.getModel(req.params.entity);
		if(!model)
			return res.status(400).send("Invalid model.");

		var query = null;
		if(req.query && req.query.q)
			query = req.query.q;

		logger.debug(query);

		//https://localhost:443/api/de/dao/teste?q={"where":{"id":{"$lt":10}},"limit":4}

		try{
			query = JSON.parse(query);
		}catch(e){
			return res.status(400).send("Query parse error: " +e);
		}

		model.findAll(query)
		.then(function(entities){
			return res.status(200).send(entities);
		})
		.catch(function(e){
			return res.status(500).send(e);
		});	
	});

	router.get(expressRouteId, checkEntity, function(req, res){

		var model = deModelPool.getModel(req.params.entity);
		if(!model)
			return res.status(400).send("Invalid model.");
		
		model.findAll({where : { id : req.params.id }})
		.then(function(entities){
			return res.status(200).send(entities);
		})
		.catch(function(e){
			return res.status(500).send(e);
		});	

	});

	router.post(expressRouteSimple, checkEntity, function(req, res){

		var model = deModelPool.getModel(req.params.entity);
		if(!model)
			return res.status(400).send("Invalid model.");
		
		model.create(req.body)
		.then(function(entity){
			return res.status(200).send(entity);
		})
		.catch(function(e){
			return res.status(500).send(e);
		});	

	});

	router.put(expressRouteId, checkEntity, function(req, res){

		var model = deModelPool.getModel(req.params.entity);
		if(!model)
			return res.status(400).send("Invalid model.");

		if(!req.params.id || !req.body.id)
			return res.status(400).send("Missing param ID or body ID");

		if(req.params.id != req.body.id)
			return res.status(400).send("Divergent param ID & body ID");
		
		model.findById(req.body.id)
		.then(function(entity){

			if(!entity)
				return res.status(500).send("That register does not exit");

			entity.update(req.body)
				.then(function(entity){					
					return res.status(200).send(entity);
				})
				.catch(function(e){
					return res.status(500).send("update error " +e);
				});	
		})
		.catch(function(e){
			return res.status(500).send("Find to update error " +e);
		});	

	});

	router.delete(expressRouteId, checkEntity, function(req, res){

		var model = deModelPool.getModel(req.params.entity);
		if(!model)
			return res.status(400).send("Invalid model.");
		
		model.findById(req.params.id)
		.then(function(entity){

			if(!entity)
				return res.status(500).send("That register does not exit");

			entity.destroy()
				.then(function(entity){					
					return res.status(200).send({"message" : "deleted"});
				})
				.catch(function(e){
					return res.status(500).send("Delete error "+e);
				});	
		})
		.catch(function(e){
			return res.status(500).send("Find to delete error "+e);
		});	

	});
}

module.exports = DERouter;