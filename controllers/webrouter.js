var express = require('express');
var logger = require('winston');

var WebRouter = function(){

	router = express.Router();


	router.route('/').get(function(req, res, next){
		logger.debug('/web');
		logger.info("Index.html");
		res.sendfile('web/public/index.html');
	});

	setRouteTemplates();
	setRouteLogin();

	return router;
}

var isAuthorized = function(req, res, next){

		if (req.session && req.session.user) {
			//TODO: Find user in database
			
			logger.info("HAS SESSION - " + JSON.stringify(req.session));
		    req.user = req.session.user;

		    // finishing processing the middleware and run the route
		    return next();
		}

		return res.status(401).send();

		// var authToken = req.headers.authorization;

		// logger.debug(authToken);

		// if(!authToken){
		// 	console.log("Not authorized");
		//  	return res.status(401).send();

		// }else if(authToken == "Bearer defaulttokenaccess"){

		// 	return next();

		// }else{
		// 	return res.status(403).send();
		// }
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

		if(username != "admin" || password != "admin")
			return res.status(401).json({error: "You don't have access to this page"});

		req.session.user = {username: username, token: token};
		res.send({token: token});

	});
}

module.exports = WebRouter;