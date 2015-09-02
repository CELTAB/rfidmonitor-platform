var express = require('express');
var logger = require('winston');
var BearerStrategy = require('passport-http-bearer').Strategy
var passport = require('passport');
var fs = require('fs')
var path = require('path');

var AppClient = require('../models/appclient');
var AppClientDao = require('../dao/appclientdao');

var AccessToken = require('../models/accesstoken');
var AccessTokenDao = require('../dao/accesstokendao');

var RouterAccess = require('../models/routeraccess');
var RouterAccessDao = require('../dao/routeraccessdao');

var routes = require('../utils/routes');
var DynamicEntities = require('./dynamicentities');
var deModelPool = require('./demodelpool');

var DynamicEntity = require('../models/orm/dynamicentity');
var PlatformMedia = require('../models/orm/platformmedia');

var multer  = require('multer')
var upload = multer({ dest: 'restricted_media/tmp/' })

var appDir = path.dirname(require.main.filename);

var DERouter = function(){


	router = express.Router();
	appClientDao = new AppClientDao();
	accessTokenDao = new AccessTokenDao();
	routerAccessDao = new RouterAccessDao();

	//this also syncs the database through deModelPool call.
	dynamicEntities = new DynamicEntities();

	setRouteOriginalInfo();
	setRouteEntityActivate();
	setRouteEntityDeactivate();
	setRouteMetaInfo();
	setRouteRegisterEntity();
	setRouteDeDao();
	setRoutePlatformMedia();

	return router;
}

var validateBearer = function(token, done) {
	logger.debug('validateBearer');

	accessTokenDao.getByValue(token, function (err, token) {

        if (err) { return done(err); }

        // No token found
        if (!token) { return done(null, false); }

        appClientDao.getById(token.appClientId , function (err, client) {
            if (err) { return done(err); }

            // No user found
            if (!client) { return done(null, false); }

            // Simple example with no scope
            logger.debug("BearerStrategy : SUCCESS");
            done(null, {clientId: client.id, clientName: client.clientName}, { scope: '*' });
        });
    });
}

var setRouteMetaInfo = function(){

	var dbRoute = '/api/de/meta';
	var expressRouteSimple = '/de/meta';
	var expressRouteId = expressRouteSimple + '/:entity';

	routes.register(dbRoute, routes.getMethods().GET);

	router.get(expressRouteSimple,function(req, res){

		DynamicEntity.findAll(
			
			{attributes : ['meta'], where: {active: true}}

			)
		.then(function(entities){
			var response = [];
			for(var i in entities){
				response.push(JSON.parse(entities[i].meta));
			}
			return res.status(200).send(response);
		})
		.catch(function(e){
			return res.status(500).send(e);
		});		

	});

	router.get(expressRouteId,function(req, res){

		DynamicEntity.findAll({where : { identifier : req.params.entity }})
		.then(function(entities){
			return res.status(200).send(entities);
		})
		.catch(function(e){
			return res.status(500).send(e);
		});	

	});
}

var setRouteOriginalInfo = function(){

	var dbRoute = '/api/de/original';
	var expressRouteSimple = '/de/original';
	var expressRouteId = expressRouteSimple + '/:entity';

	routes.register(dbRoute, routes.getMethods().GET);

	router.get(expressRouteSimple,function(req, res){

		DynamicEntity.findAll({
			attributes : ['original', 'active']
		})
		.then(function(entities){
			var response = [];
			for(var i in entities){


				var entity = entities[i].original;

				logger.warn(entities[i].active);
				
				entity = JSON.parse(entity);


				entity.active = entities[i].active;
				logger.info(entity);

				response.push(entity);
			}
			return res.status(200).send(response);
		})
		.catch(function(e){
			return res.status(500).send(e);
		});		

	});

	router.get(expressRouteId,function(req, res){

		DynamicEntity.findOne({where : { identifier : req.params.entity }})
		.then(function(entities){
			var entity = entities.original;

			entity = JSON.parse(entity);
			entity.active = entities.active;

			return res.status(200).send(entity);
		})
		.catch(function(e){
			return res.status(500).send(e);
		});	

	});
}


var setRouteEntityActivate = function(){

	var dbRoute = '/api/de/activate';
	var expressRouteSimple = '/de/activate';
	var expressRouteId = expressRouteSimple + '/:entity';

	routes.register(dbRoute, routes.getMethods().PUT);

	router.put(expressRouteId, checkEntity, function(req, res){

		logger.warn(req.params.entity);

		DynamicEntity.findOne({
			where: { identifier: req.params.entity}
		}).then(function(entity){

			if(!entity)
				return res.status(400).send("Invalid Entity.");


			logger.info(entity.identifier);

			entity.active = true;
			entity.save().then(function(ok){
				return res.status(200).send("OK");
			});

		}).catch(function(e){
			return res.status(500).send(e);
		});

	});
}


var setRouteEntityDeactivate = function(){

	var dbRoute = '/api/de/deactivate';
	var expressRouteSimple = '/de/deactivate';
	var expressRouteId = expressRouteSimple + '/:entity';

	routes.register(dbRoute, routes.getMethods().PUT);

	router.put(expressRouteId, checkEntity, function(req, res){

		logger.warn(req.params.entity);

		DynamicEntity.findOne({
			where: { identifier: req.params.entity}
		}).then(function(entity){

			if(!entity)
				return res.status(400).send("Invalid Entity.");

			entity.active = false;
			entity.save().then(function(ok){
				return res.status(200).send("OK");
			});

		}).catch(function(e){
			return res.status(500).send(e);
		});

	});
}

var setRouteRegisterEntity = function(){

	var dbRoute = '/api/de/register';
	var expressRouteSimple = '/de/register';
	var expressRouteId = expressRouteSimple + '/:entity';

	routes.register(dbRoute, routes.getMethods().POST);

	router.post(expressRouteSimple,function(req, res){

		dynamicEntities.registerEntity(req.body, function(errors){
			if(errors)
				return res.status(500).send('errors : ' + JSON.stringify(errors));	
			
			return res.status(200).send({"message" : "OK"});
		});

	});
}

var checkEntity = function(req, res, next){
	logger.debug("api/de/dao/ checking for valid model of " + req.params.entity);
	
	if(deModelPool.getModel(req.params.entity))
		return next();

	res.status(400).send("NOT A VALID ENTITY");
}

var setRouteDeDao = function(){

	//TODO specify new kind of authorization for dynamic routes.
	//Example: /api/de/dao/car , /api/de/dao/person/4

	var dbRoute = '/api/de/dao';
	var expressRouteSimple = '/de/dao/:entity';
	var expressRouteId = expressRouteSimple + '/:id';

	routes.register(dbRoute, routes.getMethods().GET);


	router.get(expressRouteSimple, checkEntity, function(req, res){
		//https://localhost:443/api/de/dao/teste?q={"where":{"id":{"$lt":10}},"limit":4}

		var model = deModelPool.getModel(req.params.entity);
		if(!model)
			return res.status(400).send("Invalid model.");

		var query = null;
		if(req.query && req.query.q){
			query = req.query.q;
			logger.debug(query);
			
			try{
				query = JSON.parse(query);
			}catch(e){
				return res.status(400).send("Query parse error: " +e);
			}
		}



		if(!query)
			query = {};

		model.findAll(query)
		.then(function(entities){
			return res.status(200).send(entities);
		})
		.catch(function(e){
			return res.status(500).send(e);
		});	
	});

	router.get(expressRouteId, checkEntity, function(req, res){

		var model = deModelPool.getModel(req.params.entity);
		if(!model)
			return res.status(400).send("Invalid model.");
		
		model.findOne({where : { id : req.params.id }})
		.then(function(entity){
			if(!entity)
				return res.status(400).send("not found");
			return res.status(200).send(entity);
		})
		.catch(function(e){
			return res.status(500).send("getbyid dao error : " +e);
		});	

	});

	routes.register(dbRoute, routes.getMethods().POST);

	router.post(expressRouteSimple, checkEntity, function(req, res){

		var model = deModelPool.getModel(req.params.entity);
		if(!model)
			return res.status(400).send("Invalid model.");
		
		model.create(req.body)
		.then(function(entity){
			return res.status(200).send(entity);
		})
		.catch(function(e){
			return res.status(500).send(e);
		});	

	});

	routes.register(dbRoute, routes.getMethods().PUT);

	router.put(expressRouteId, checkEntity, function(req, res){

		var model = deModelPool.getModel(req.params.entity);
		if(!model)
			return res.status(400).send("Invalid model.");

		if(!req.params.id || !req.body.id)
			return res.status(400).send("Missing param ID or body ID");

		if(req.params.id != req.body.id)
			return res.status(400).send("Divergent param ID & body ID");
		
		model.findById(req.body.id)
		.then(function(entity){

			if(!entity)
				return res.status(500).send("That register does not exit");

			entity.update(req.body)
				.then(function(entity){					
					return res.status(200).send(entity);
				})
				.catch(function(e){
					return res.status(500).send("update error " +e);
				});	
		})
		.catch(function(e){
			return res.status(500).send("Find to update error " +e);
		});	

	});

	routes.register(dbRoute, routes.getMethods().DELETE);

	router.delete(expressRouteId, checkEntity, function(req, res){

		var model = deModelPool.getModel(req.params.entity);
		if(!model)
			return res.status(400).send("Invalid model.");
		
		model.findById(req.params.id)
		.then(function(entity){

			if(!entity)
				return res.status(500).send("That register does not exit");

			entity.destroy()
				.then(function(entity){					
					return res.status(200).send({"message" : "deleted"});
				})
				.catch(function(e){
					return res.status(500).send("Delete error "+e);
				});	
		})
		.catch(function(e){
			return res.status(500).send("Find to delete error "+e);
		});	

	});
}

var setRoutePlatformMedia = function(){
	var dbRoute = '/api/media';
	var expressRouteSimple = '/media';
	var expressRouteId = expressRouteSimple + '/:id';

	routes.register(dbRoute, routes.getMethods().GET);

	router.get(expressRouteId, function(req, res){
		
		PlatformMedia.findOne({where : { id : req.params.id }})
		.then(function(record){
			return res.sendfile(path.join(appDir, record.path), options);		
		})
		.catch(function(e){
			return res.status(500).send("Error while getting media: "+e);
		});	

	});

	routes.register(dbRoute, routes.getMethods().POST);

	router.post(expressRouteSimple, upload.single('image'), function(req, res){
		logger.warn("remember to remove body parser because of this http://andrewkelley.me/post/do-not-use-bodyparser-with-express-js.html");

		if(!req.file)
			return res.status(400).send("We didnt receive you file");

		var file = req.file;

		if(file.size > 5 * 1024 * 1024)
			return res.status(400).send("file bigger than 5mb");

		file.finalPath = appDir + '/restricted_media/media/images/' + req.file.filename;

		logger.debug(req.file.path);

		fs.readFile(req.file.path, function (err, data) {
		    if (err){
		    	 return res.status(500).send("error read" + err);
		    }
		    fs.writeFile(file.finalPath, data, function (err) {
		        if (err){
			    	 return res.status(500).send("error " + err);
			    }

			    PlatformMedia.create(
			    	{
			    		url: file.filename,
			    		path : 'restricted_media/media/images/' + file.filename,
			    		type: 'IMAGE'
			    	})
			    .then(function(f){

			    	f.url = 'https://localhost/api/media/'+f.id;
			    	f.save().then(function(f){

						return res.status(200).send({"mediaId" :f.id});
			    	}).catch(function(e){
			    		return res.status(500).send("error " + e);
			    	});
			    }).catch(function(e){
			    	return res.status(500).send("error " + e);
			    });		        
		    });
		});




	});
}

module.exports = DERouter;