var express = require('express');
var logger = require('winston');

var WebRouter = function(){

	router = express.Router();

	//Return the index web page
	router.route('/').get(function(req, res, next){
		res.sendfile('web/public/index.html');
	});

	setRouteTemplates();
	setRouteLogin();

	return router;
}

var isAuthorized = function(req, res, next){

		if (req.appSession && req.appSession.user) {
			//TODO: Find user in database
			
			logger.info("HAS SESSION - " + JSON.stringify(req.appSession));

		    req.user = req.appSession.user;

			var authToken = req.headers.authorization;

			logger.debug(authToken);

			if(!authToken){
				logger.info("Not authorized");
			 	return res.status(401).send();

			}else if(authToken == "Bearer defaulttokenaccess"){

				return next();

			}else{
				return res.status(403).send();
			}

		    // finishing processing the middleware and run the route
		}

		logger.info("SESSION NOT FOUND");
		return res.status(401).send();
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
	router.route('/login').post(function(req, res){

		logger.debug("ReqBody... " + JSON.stringify(req.body));

		var username = req.body.username;
		var password = req.body.password;
		var token = "defaulttokenaccess";

		//Test user. Temporary
		if(username != "admin" || password != "admin")
			return res.status(401).json({error: "You don't have access to this page"});

		//TODO: implement the database verification for users
		req.appSession.user = {username: username, email: 'admin@rfidplatform.com'};
		res.send({username: username, email: 'admin@rfidplatform.com', token: token});

	});

	router.route('/logout').post(function(req, res){
		//Remove the session information
		delete req.appSession.user;
		res.status(200).send();
	});
}

module.exports = WebRouter;