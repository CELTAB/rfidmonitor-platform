var express = require('express');
var logger = require('winston');

var WebRouter = function(){

	router = express.Router();

	setRouteTemplates();
	setRouteLogin();

	return router;
}

var isAuthorized = function(req, res, next){
		var authToken = req.headers.authorization;

		if(!authToken){
			console.log("Not authorized");
		 	return res.status(401).send();

		}else if(authToken == "Bearer defaulttokenaccess"){

			next();
		}else{
			return res.status(403).send();
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
	router.route('/login').post(function(req, res){

		logger.debug(JSON.stringify(req.body));

		var username = req.body.username;
		var password = req.body.password;
		var token = "defaulttokenaccess";

		if(username != "thiago" || password != "thiago")
			return res.status(401).json({error: "You don't have access to this page"});

		res.send({token: token});

	});
}

module.exports = WebRouter;