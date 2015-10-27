'use strict';
var logger = require('winston');
var sequelize = require(__base + 'controller/database/platformsequelize');
var errorHandler = require(__base + 'utils/errorhandler');
var DynamicEntity = sequelize.model('DynamicEntity');

var originalHandler = function(req, callback){
  if(req.params.entity){
    DynamicEntity.findOne({where : { identifier : req.params.entity }})
    .then(function(entities){
      if(entities){
        var entity = entities.original;
        entity = JSON.parse(entity);
        entity.active = entities.active;
        return callback(null, entity);
      }else{
        return errorHandler('Entity not found', 400, callback);
      }
    })
    .catch(function(e){
      return errorHandler(e.toString(), 500, callback);
    });
  }else{
    DynamicEntity.findAll({
			attributes : ['original', 'active']
		})
		.then(function(entities){
			var response = [];
			for(var i in entities){
				var entity = entities[i].original;
				entity = JSON.parse(entity);
				entity.active = entities[i].active;
				response.push(entity);
			}
      return callback(null, response);
		})
		.catch(function(e){
      return errorHandler(e.toString(), 500, callback);
		});
  }
};
var Route = require(__base + 'utils/customroute');
var routes = [
  new Route('get', '/de/original', originalHandler),
  new Route('get', '/de/original/:entity', originalHandler)
];

module.exports = routes;
