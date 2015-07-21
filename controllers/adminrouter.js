var express = require('express');
var authController = require('./auth');
var logger = require('winston');


var AdminRouter = function(){
	router = express.Router();
	routeAppClients();

	// router.route('/login').post(function(req, res){

	// 	logger.debug(JSON.stringify(req.body));

	// 	var username = req.body.username;
	// 	var password = req.body.password;
	// 	var token = "defaulttokenaccess";

	// 	if(username != "admin" || password != "admin")
	// 		return res.status(401).json({error: "You don't have access to this page"});

	// 	req.headers.Authorization = "Bearer " + token;
	// 	// logger.warn(JSON.stringify(req.headers));

	// 	res.send({token: token, nextUrl: '/admin/home'});

	// });

	// router.route('/home').

	return router;
}

var routeAppClients = function(){
	
}

module.exports = AdminRouter;