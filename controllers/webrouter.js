var express = require('express');
var logger = require('winston');

var WebRouter = function(){

	router = express.Router();

	//Return the index web page
	// router.route('/').get(function(req, res, next){
	// 	res.sendfile('web/public/index.html');
	// });

	// setRouteTemplates();
	setRouteLogin();

	return router;
}

var isAuthorized = function(req, res, next){

		// logger.warn(req.appSession);
		logger.warn(req.appSession);

		if (req.appSession && req.appSession.user) {
			//TODO: Find user in database
			
			logger.info("HAS SESSION - " + JSON.stringify(req.appSession));
			logger.info("SUCESSO!!");
			var user = req.appSession.user;

			return res.status(200).send({message: "Usuario logado - " + user.username});
		 //    req.user = req.appSession.user;

			// var authToken = req.headers.authorization;

			// logger.debug(authToken);

			// if(!authToken){
			// 	logger.info("Not authorized");
			//  	return res.status(401).send({message: "Not authorized"});

			// }else if(authToken == "Bearer defaulttokenaccess"){

			// 	return next();

			// }else{
			// 	return res.status(403).send({message: "Not authorized"});
			// }

		    // finishing processing the middleware and run the route
		}else{
			logger.info("SESSION NOT FOUND");
			return next();
		}
}

var setRouteTemplates = function(){
	
	var templateRoute = "web/template";

	router.route('/login.html').get(
		function(req, res){
			return res.status(200).sendfile(templateRoute + '/login.html');
		}
	);

	router.route('/noAccess.html').get(
		function(req, res){
			return res.status(200).sendfile(templateRoute + '/noAccess.html');
		}
	);

	router.route('/home.html').get(isAuthorized, 
		function(req, res){
			return res.status(200).sendfile(templateRoute + '/home.html');
		}
	);

	router.route('/clients.html').get(isAuthorized, 
		function(req, res){
			return res.status(200).sendfile(templateRoute + '/clients.html');
		}
	);
}

var setRouteLogin = function(){

	var sequelize = require('../dao/platformsequelize');

	router.route('/login').post(function(req, res){

		if(!req.body.username || !req.body.password)
			return res.status(400).send({message: "Missing username ou password"});

		logger.info("Username: " + req.body.username);
		logger.info("password: " + req.body.password);

		try{

			var User = sequelize.model("User");

			User.scope('loginScope').findOne({where: {username: req.body.username}})
				.then(function(user){

					if(user){

						if(user.isPasswordValid(req.body.password)){

							user = user.clean();
							var AppClient = sequelize.model('AppClient');

							AppClient.find(
									{
										where: {user_id: user.id}
									})
								.then(function(app){

									if(app){

										user.token = "defaulttokenaccess";
										// user.token = app.token;
										req.appSession.user = {id: user.id, username: user.username, email: user.email};
										return res.status(200).send(user);
									}else{
										logger.error("Token not found for user " + user.username);
										return res.status(401).send({message: "User not allowed"});
									}

								}).catch(function(err){
									logger.error("Find AppClient: " + err);
									return res.send(500).send({message: "INTERNAL ERROR : " + err});				
								});

						}else{
							return res.status(400).send({message:"Password don't match to this user"});
						}

					}else{
						return res.status(400).send({message: "Username not match to any user"});
					}

				})
				.catch(function(e){
					logger.error("Find User: " + e);
					return res.send(500).send({message: "INTERNAL ERROR : " + e});
				});

		}catch(error){
			logger.error(error);
			return res.send(500).send({message: "INTERNAL ERROR : " + error});
		}

		// logger.debug("ReqBody... " + JSON.stringify(req.body));

		// var username = req.body.username;
		// var password = req.body.password;
		// var token = "defaulttokenaccess";

		// //Test user. Temporary
		// if(username != "admin" || password != "admin")
		// 	return res.status(401).json({error: "You don't have access to this page"});

		// //TODO: implement the database verification for users
		// req.appSession.user = {username: username, email: 'admin@rfidplatform.com'};
		// res.send({username: username, email: 'admin@rfidplatform.com', token: token});

	});

	// router.route('/login').get(function(req, res){

	// 	var template = '<form action="https://localhost:8143/web/login" method="POST">' + 
	// 					  'Usuario:<br>' + 
	// 					  '<input type="text" name="username" placeholder="User">' + 
	// 					  ' <br> ' +
	// 					  'Senha:<br>' +
	// 					  '<input type="password" name="password" placeholder="Password">' +
	// 					  ' <br><br>' +
	// 					  '<input type="submit" value="Login">' + 
	// 					' </form>';

	// 	return res.send(template);

	// });


	router.route('/logout').post(function(req, res){
		//Remove the session information
		delete req.appSession.user;
		res.status(200).send({message: "Lougout, no access to this page anymore"});
	});
}

module.exports = WebRouter;