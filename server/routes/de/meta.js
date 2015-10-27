'use strict';
var logger = require('winston');
var sequelize = require(__base + 'controller/database/platformsequelize');
var errorHandler = require(__base + 'utils/errorhandler');
var DynamicEntity = sequelize.model('DynamicEntity');

var metaHandler = function(req, callback){
  if(req.params.entity){
    DynamicEntity.findOne({where : { identifier : req.params.entity }})
    .then(function(entity){
      if(entity){
        return callback(null, entity);
      }else{
        return errorHandler('Entity not found', 400, callback);
      }
    })
    .catch(function(e){
      return errorHandler(e.toString(), 500, callback);
    });
  }else{
    DynamicEntity.findAll(
      {attributes : ['meta'], where: {active: true}}
    )
		.then(function(entities){
			var response = [];
			for(var i in entities){
				response.push(JSON.parse(entities[i].meta));
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
  new Route('get', '/de/meta', metaHandler),
  new Route('get', '/de/meta/:entity', metaHandler)
];

module.exports = routes;
