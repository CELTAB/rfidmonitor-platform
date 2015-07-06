var express = require('express');
var authController = require('./auth');

var User = require('../models/user');
var UserDao = require('../dao/userdao');

var PlatformRouter = function(){

	router = express.Router();
	userDao = new UserDao();

	routeUsers();

	return router;
}

var routeUsers = function(){
	// api/users
	router.route('/users')

	  .get(authController.isAuthenticated, function(req, res){
	  	//find all users;

	  	userDao.getAll(function(err, users){
	  		if(err)
	  			return res.json(err)

	  		res.json(users);
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

	  });
}

module.exports = PlatformRouter;