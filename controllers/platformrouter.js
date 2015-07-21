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

var routes = require('../utils/routes');



var PlatformRouter = function(){

	router = express.Router();
	userDao = new UserDao();
	appClientDao = new AppClientDao();
	accessTokenDao = new AccessTokenDao();
	routerAccessDao = new RouterAccessDao();

	passport.use('api-bearer', new BearerStrategy({}, validateBearer));
	setAuthorization();

	setRouteUsers();
	setRouteAppClients();

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

			// req._parsedOriginalUrl.pathname 
			var requestInfo = {
				clientId: req.user.clientId,
				route: req.originalUrl,
				methodName: req.method
			};
			routerAccessDao.getAccess(requestInfo, function(err, result){

                if(err) {
                	logger.error("setAuthorization routerAccessDao ");
                	return res.status(501).send("INTERNAL ERROR");
				}

                if(result){
                	//ACCESS GRANTED.
                    next();
                }else{
                    res.status(403).send("YOU DONT HAVE THE AUTH. GET OUT DOG....");
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
				return res.status(501).json(err)

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

module.exports = PlatformRouter;