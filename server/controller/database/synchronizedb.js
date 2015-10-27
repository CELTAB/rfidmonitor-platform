'use strict';
var logger = require('winston');
var DEModelPool = require(__base + 'controller/dynamic/demodelpool');
var sequelize = require(__base + 'controller/database/platformsequelize');
var SynchronizeDb = function() {

	var _start = function(done){
		//TODO: Remover requirede de todos os outros lugares. Seria redundante. Usar sequelize.model('nome');
		//TODO: Verificar a eliminação do sequelizeClass e usar apenas rfidplatformSequeleize. Se possível.
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

		//TODO: Do not use {force: true} on production
		sequelize.sync({force: true}).then(function(){
		// sequelize.sync().then(function(){

			//Models synchronized. Call done with no errors (null).
			DEModelPool.loadDynamicEntities(function(error){
				if(error) return done(error);
				done();
			});
			// done(null);
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

module.exports = SynchronizeDb;
