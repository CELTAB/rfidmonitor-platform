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

var setRouteMetaInfo = function(){

	var dbRoute = '/api/de/meta';
	var expressRouteSimple = '/de/meta';
	var expressRouteId = expressRouteSimple + '/:entity';

	routes.register(dbRoute, routes.getMethods().GET);

	router.get(expressRouteSimple,function(req, res){

		return res.status(200).send({});

	});

	router.get(expressRouteId,function(req, res){

		return res.status(200).send(req.params);

	});
}

var setRouteRegisterEntity = function(){

	var dbRoute = '/api/de';
	var expressRouteSimple = '/de';
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

module.exports = DERouter;