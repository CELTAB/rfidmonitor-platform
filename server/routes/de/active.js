'use strict';
var logger = require('winston');
var sequelize = require(__base + 'controller/database/platformsequelize');
var DynamicEntity = sequelize.model('DynamicEntity');
var deModelPool = require(__base + 'controller/dynamic/demodelpool');
var errorHandler = require(__base + 'utils/errorhandler');

var activeHandler = function(req, callback){
  if(!deModelPool.getModel(req.params.entity))
		return errorHandler('Invalid Entity.', 400, callback);

  var value = req.path.indexOf('deactivate') !== -1 ? false : true;
  DynamicEntity.findOne({
		where: { identifier: req.params.entity}
	})
  .then(function(entity){
    if(!entity)
      return errorHandler('Invalid Entity.', 400, callback);

    entity.active = value;
    entity.save().then(function(ok){
      return callback(null, 'OK');
    });
  })
  .catch(function(e){
    return errorHandler(500, e.toString(), callback);
  });
}

var Route = require(__base + 'utils/customroute');
var routes = [
  new Route('put', '/de/activate/:entity', activeHandler),
  new Route('put', '/de/deactivate/:entity', activeHandler)
];

module.exports = routes;
