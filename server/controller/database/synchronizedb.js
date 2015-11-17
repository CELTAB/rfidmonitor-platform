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

						return createDefaults(done);
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

var createDefaults = function(done){

	var errorHandler = function(e){
		return done('Error on create ' + e + ' default');
	};

	var User = sequelize.model('User');
	var AppClient = sequelize.model('AppClient');

	var defaultUser = {name: 'Default Administrator', username: 'admin', password: 'admin', email:'invalid@email.com'};
	User.create(defaultUser).then(function(user){
		var app = {description: 'Default appClient for ' + user.username, userId: user.id};
		AppClient.create(app).then(function(appCreated){
			return defaultGroup(done);
		})
		.catch(function(e){
			logger.error('Error on create default AppClient' + e.toString());
			return errorHandler('AppClient');
		});
	})
	.catch(function(e){
		logger.error('Error on create default User' + e.toString());
		return errorHandler('User');
	});
};

var defaultGroup = function(done){
	var Group = sequelize.model('Group');
	Group.find({where: {isDefault: true, deletedAt: null}})
	.then(function(group){
		if(group){
			return done();
		}

		var defaultGroup = {isDefault: true, name: "Default Group", description: "Auto-generated default group"};
		Group.create(defaultGroup)
		.then(function(nGroup){
			return done();
		})
		.catch(function(e){
			logger.error('Error on create default Group' + e.toString());
			return done(e);
		});
	});
}

module.exports = SynchronizeDb;
