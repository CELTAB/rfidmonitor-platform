'use strict';
var logger = require('winston');
var deModelPool = require(__base + 'controller/dynamic/demodelpool');
var errorHandler = require(__base + 'utils/errorhandler');

var promisesHandler = function(callback){
  var _cb = callback;
  return{
    success: function(result){
      if(Array.isArray(result))
        return _cb(null, result);
      if(!result){
        return errorHandler('Record not found', 400, _cb);
      }
      return _cb(null, result);
    },
    error: function(err){
      return errorHandler(err.toString(), 500, _cb);
    }
  }
};

var getHandler = function(req, callback){
  var model = deModelPool.getModel(req.params.entity);
  if(!model)
    return errorHandler('Invalid Entity', 400, callback);

  var promises = promisesHandler(callback);
  var query = null;
  if(req.query && req.query.q){
    query = req.query.q;
    logger.debug(query);

    try{
      query = JSON.parse(query);
    }catch(e){
      return errorHandler('Query parser error: ' + e.toString(), 400, callback);
    }
  }
  if(!req.params.id){
    model.findAll(query || {}).then(promises.success).catch(promises.error);
  }else{
    query = query || {};
    query.where = {id: req.params.id};
    model.findOne(query).then(promises.success).catch(promises.error);
  }
}

var postHandler = function(req, callback){
  var model = deModelPool.getModel(req.params.entity);
  if(!model)
    return errorHandler('Invalid Entity', 400, callback);

  var promises = promisesHandler(callback);
  model.create(req.body).then(promises.success).catch(promises.error);
}

var putHandler = function(req, callback){
  var model = deModelPool.getModel(req.params.entity);
  if(!model)
    return errorHandler('Invalid Entity', 400, callback);

  if(!req.params.id || !req.body.id)
    return errorHandler('Missing param ID or body ID', 400, callback);

	if(req.params.id != req.body.id)
    return errorHandler('Divergent param ID & body ID', 400, callback);

  var promises = promisesHandler(callback);
	model.findById(req.body.id)
	.then(function(entity){
		if(!entity)
      return errorHandler('That register does not exist', 400, callback);

		entity.update(req.body)
			.then(promises.success).catch(promises.error);
	}).catch(promises.error);
}

var deleteHandler = function(req, callback){
  var model = deModelPool.getModel(req.params.entity);
  if(!model)
    return errorHandler('Invalid Entity', 400, callback);

  var promises = promisesHandler(callback);
  model.findById(req.params.id)
  .then(function(entity){

    if(!entity)
      return errorHandler('That register does not exist', 400, callback);

    entity.destroy()
      .then(function(entity){
        return callback(null, {"message" : "deleted"});
      })
      .catch(promises.error);
  }).catch(promises.error);
}

var Route = require(__base + 'utils/customroute');
var routeStr = '/de/dao/:entity';
var routes = [
  new Route('get', routeStr, getHandler),
  new Route('get', routeStr + '/:id', getHandler),
  new Route('post', routeStr, postHandler),
  new Route('put', routeStr + '/:id', putHandler),
  new Route('delete', routeStr + '/:id', deleteHandler)
];

module.exports = routes;
