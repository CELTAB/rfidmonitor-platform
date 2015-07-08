var express = require('express');
var authController = require('./auth');
var oauth2Controller = require('./oauth2');
var logger = require('winston');

var User = require('../models/user');
var UserDao = require('../dao/userdao');
var AppClient = require('../models/appclient');
var AppClientDao = require('../dao/appclientdao');

var PlatformRouter = function(){

	router = express.Router();
	userDao = new UserDao();
	appClientDao = new AppClientDao();

	routeOauth2();
	routeUsers();
	routeAppClients();

	return router;
}

var routeOauth2 = function(){
	// Create endpoint handlers for oauth2 authorize
	router.route('/oauth2/authorize')
	  .get(authController.isAuthenticated, oauth2Controller.authorization)
	  .post(authController.isAuthenticated, oauth2Controller.decision);

	// Create endpoint handlers for oauth2 token
	router.route('/oauth2/token')
	  .post(authController.isClientAuthenticated, oauth2Controller.token);

}

var routeUsers = function(){
	// api/users
	router.route('/users')

		.get(authController.isAuthenticated, function(req, res){
	  		//find all users;

	  		//use req.authInfo for especific informations
	  		//use req.user.userId for user id and req.user.username for username

			var obj = {
				clientId: req.user.userId,
				route: "/api/users",
				methodName: "GET"
			};

			var RouterController = require('./routeraccesscontroller');
			var rCtrl = new RouterController();

			rCtrl.hasAuthorization(obj, function(hasAccess){
				if(hasAccess){
						userDao.getAll(function(err, users){
				  		if(err)
				  			return res.json(err)

			  			// logger.info("RESPONSE>>>>" + utils.inspect(res, {showHidden: false, depth: null}));
				  		res.json(users);
				  	});
				}else{
					res.json({error: "Access Denied"});
				}
			});
		})

		.post(function(req, res){
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

		}
	);
}

var routeAppClients = function(){
	/*
	Get all clients
	Ex: api/clients
	*/
	router.route('/clients')

		.get(authController.isAuthenticated, function(req, res){
			//find all users;

			appClientDao.getAll(function(err, appClient){
				if(err)
					return res.json(err)

				res.json(appClient);
			});

		})

		.post(authController.isAuthenticated, function(req, res){
			//insert user;

			var client = new AppClient();
			client.name = req.body.name;
			client.oauthId = req.body.oauthId;
			client.oauthSecret = req.body.oauthSecret;
			client.userId = req.user.id;
			
			appClientDao.insert(client, function(err, id){
				if(err)
						return res.json(err)

					client.id = id;
					res.json(client);
			});

		}
	);

	// /*
	// get a client by id
	// Ex: api/clients/45
	// */
	// router.route('/clients/:client_id')

	// 	.get(authController.isAuthenticated, function(req, res){
	// 		//find all users;

	// 		appClientDao.getById(req.params.client_id, function(err, appClient){
	// 			if(err)
	// 				return res.json(err)

	// 			res.json(appClient);
	// 		});

	// 	})
	// );
}

module.exports = PlatformRouter;