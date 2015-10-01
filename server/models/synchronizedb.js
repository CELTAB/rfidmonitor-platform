var logger = require('winston');

// var DEModelPool = require('../controllers/demodelpool');
var sequelize = require(__base + 'controller/platformsequelize');

var SynchronizeDb = function() {

	this.start = function(done){
		
		//TODO: Remover requirede de todos os outros lugares. Seria redundante. Usar sequelize.model('nome');
		//TODO: Verificar a eliminação do sequelizeClass e usar apenas rfidplatformSequeleize. Se possível.

		// require('../models/orm/dynamicentity');
		// require('../models/orm/platformmedia');

		// require('../models/seqaccesstoken');
		// require('../models/seqappclient');
		// require('../models/seqrouteaccess');
		// require('../models/sequriroute');
		// require('../models/sequser');

		require(__base + 'models/group');
		require(__base + 'models/collector');
		require(__base + 'models/user');

		// sequelize.sync({force: true}).then(function(){
		sequelize.sync().then(function(){

			//Models synchronized. Call done with no errors (null).
			// DEModelPool.loadDynamicEntities(function(error){

			// 	if(error) return done(error);

			// 	done();

			// });
			done(null);

		}).catch(function(error){
			logger.error("Error to synchronize sequelize models: " + error);
			done(error);	
		});

	}

	return{
		start: start
	}
}();

module.exports = SynchronizeDb;