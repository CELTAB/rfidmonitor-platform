'use strict';
var logger = require('winston');
var DEModelPool = require(__base + 'controller/dynamic/demodelpool');
var sequelize = require(__base + 'controller/database/platformsequelize');
//bug
var pg = require('pg');
delete pg.native;
//end - bug

var SynchronizeDb = function() {

	var _start = function(done){
		var model = __base + 'models';
		// Load models definition to sequelize known then, and then synchronie
		require(model + '/group');
		require(model + '/collector');
		require(model + '/user');
		require(model + '/package');
		require(model + '/rfiddata');
		require(model + '/appclient');
		require(model + '/uriroute');
		require(model + '/routeaccess');
		require(model + '/dynamicentity');
		require(model + '/platformmedia');

		// sequelize.sync({force: true}).then(function(){
		sequelize.sync().then(function(){
			//Models synchronized. Call done with no errors (null).
			DEModelPool.loadDynamicEntities(function(error){
				if(error) return done(error);

				var User = sequelize.model('User');
				User.findAll().then(function(result){
					if(result.length > 0)
						return done();

						return createDefaultUser(done);
				});
			});
		})
		.catch(function(error){
			logger.error("Error to synchronize sequelize models: " + error);
			done(error);
		});
	}

	return{
		start: _start
	}
}();

var createDefaultUser = function(done){
	var User = sequelize.model('User');
	var AppClient = sequelize.model('AppClient');
	try{
		var defaultUser = {name: 'Default Administrator', username: 'admin', password: 'admin', email:'invalid@email.com'};
		User.create(defaultUser).then(function(user){
			var app = {description: 'Default appClient for ' + user.username, userId: user.id};
			AppClient.create(app).then(function(appCreated){
				return done();
			});
		});
	}catch(e){
		logger.error('Error on create default User and AppClient: ' + e.toString());
		return done(e.toString());
	}
};

module.exports = SynchronizeDb;
