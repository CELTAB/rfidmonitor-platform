var express = require('express');
var authController = require('./auth');
var oauth2Controller = require('./oauth2');
var logger = require('winston');

var AccessToken = require('../models/accesstoken');
var AccessTokenDao = require('../dao/accesstokendao');

var AppClient = require('../models/appclient');
// var AppClientDao = require('../dao/appclientdao');

var AdminRouter = function(){
	router = express.Router();
	routeAppClients();

	router.route('/login').post(function(req, res){

		logger.debug(JSON.stringify(req.body));

		var username = req.body.username;
		var password = req.body.password;
		var token = "defaultaccesstoken";

		if(username != "thiago" || password != "thiago")
			return res.status(401).json({error: "You don't have access to this page"});

		req.headers.Authorization = "Bearer " + token;
		// logger.warn(JSON.stringify(req.headers));

		res.send({token: token, nextUrl: '/admin/home'});

	});

	// router.route('/home').

	return router;
}

var routeAppClients = function(){
	router.route('/clients')
		.get(authController.isBearerAuthenticated, function(req, res){
			//find all users;
			logger.info("Connection from client " + req.user.clientName);
			appClientDao.getAll(function(err, appClient){
				if(err)
					return res.json(err)

				res.json(appClient);
			});
		})
		.post(authController.isBearerAuthenticated, function(req, res){
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
		}).delete(authController.isBearerAuthenticated, function(req, res){

			var client = new AppClient();
			appClientDao.deleteByNameAndId(req.query.clientName, req.query.id, function(err, result){

				if(err) {
					return res.json({error: "Not able to remove client"});
				}

				res.json({message: "User successfuly removed!"});
			});
		});
}

module.exports = AdminRouter;