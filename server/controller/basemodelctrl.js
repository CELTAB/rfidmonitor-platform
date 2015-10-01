var logger = require('winston');

var BaseModelController = function(model, modelName){

	var _constructRegister = function(model, modelName){

		var _Model = model;
		var _modelName = modelName;

		logger.warn("USE _modelName (" + _modelName + ") for logging purpouse");
		logger.info("Prepare default controller for " + _modelName);

		var _find = function(id, query, callback){
	
			var _handleError = function(err){
				logger.error("Error on find for document: " + err);
				var errObj = {error: err.toString(), code: 500, message : "Error on find for document."};
				return callback(errObj);
			}
			
			try{

				if(!query)
					query = {};

				query.include = [{all: true}];
				// { include: [{ all: true }]}

				if(id){
					//find by id

					console.log(query);

					_Model.findById(id, query)
					.then(function(doc){
						return callback(null, doc);
					})
					.catch(function(err){
						return _handleError(err);
					});

				}else{
					//find all
					_Model.findAll(query).then(function(docs){
						return callback(null, docs);
					}).catch(function(err){
						return _handleError(err);
					});
				}

			}catch(err){
				return _handleError(err);
			}	
		};

		var _save = function(body, callback){

			var _handleError = function(err){
				logger.error("Error on save document: " + err);
				var errObj = {error:err, code:500, message: "Error on save document."};
				return callback(errObj);
			}

			try{
				body.deletedAt = null; //TODO - limpeza manual do campo para evitar que o usuário altere.

				if(body._id || body.id){

					//TODO: Mudar de _id para id
					var id = body._id || body.id;
					delete body._id;

					_Model.findById(id)
					.then(function(doc){
						if(doc){
							doc.update(body).then(function(newDoc){

								return callback(null, newDoc);

							}).catch(function(err){
								return _handleError(err);
							});
						}else{
							return callback({error:"ID Not found", code:400, message: "ID Not found"});
						}
					})
					.catch(function(err){
						return _handleError(err);
					});
				}else{
					_Model.create(body)
					.then(function(newDoc){
						return callback(null, newDoc);
					})
					.catch(function(err){
						return _handleError(err);
					});
				}

			}catch(err){
				return _handleError(err);
			}

		};

		_remove = function(id, callback){

			var _handleError = function(err){
				logger.error("Error on remove document: " + err);
				var errObj = {error:err.toString(), code:500, message: "Error on remove document."};
				return callback(errObj);
			}

			try{
				_Model.findById(id)
				.then(function(doc){
					if(doc){
						doc.destroy().then(function(){

							return callback(null, doc);

						}).catch(function(err){
							return _handleError(err);
						});
					}else{
						return callback({error:"ID Not found", code:400, message: "ID Not found"});
					}
				})
				.catch(function(err){
					return _handleError(err);
				});
			}catch(e){
				return callback({error: e, code: 400, message : "Erro ao remover doc."});
			}
		}

		return{
			find: _find,
			save: _save,
			remove: _remove,
			name: _modelName,
			custom: []
		}
	};

	return _constructRegister(model, modelName);
}

module.exports = BaseModelController;

// Não funciona, registra apenas a ultima entidade. Sobrescreve a variavel global Model.
/*

var logger = require('winston');

var BaseModelController = function(model, modelName){
	Model = model;
	ModelName = modelName;
}

BaseModelController.prototype.find = function(id, query, callback){
	
	var _handleError = function(err){
		logger.error("Error on find for document: " + err);
		var errObj = {error: err.toString(), code: 500, message : "Error on find for document."};
		return callback(errObj);
	}

	console.log("Find into entity " + ModelName);
	
	try{

		if(!query)
			query = {};

		if(id){
			//find by id

			Model.findById(id)
			.then(function(doc){
				return callback(null, doc);
			})
			.catch(function(err){
				return _handleError(err);
			});

		}else{
			//find all
			Model.findAll(query).then(function(docs){
				return callback(null, docs);
			}).catch(function(err){
				return _handleError(err);
			});
		}

	}catch(err){
		return _handleError(err);
	}	
}

BaseModelController.prototype.save = function(body, callback){

	var _handleError = function(err){
		logger.error("Error on save document: " + err);
		var errObj = {error:err.toString(), code:500, message: "Error on save document."};
		return callback(errObj);
	}

	try{
		body.deletedAt = null; //TODO - limpeza manual do campo para evitar que o usuário altere.

		if(body._id || body.id){
			//update

			//TODO: Mudar de _id para id
			var id = body._id || body.id;
			delete body._id;

			//update - sequelize
			Model.findById(id)
			.then(function(doc){
				if(doc){
					doc.update(body).then(function(newDoc){

						return callback(null, newDoc);

					}).catch(function(err){
						return _handleError(err);
					});
				}else{
					return callback({error:"ID Not found", code:400, message: "ID Not found"});
				}
			})
			.catch(function(err){
				return _handleError(err);
			});
			

			//update - mogoose
			// Model.secureUpdate(id, body ,function(err, newDoc){
			// 	if(err)
			// 		return callback({error: err, code: 500, message : "Erro ao atualizar doc."});

			// 	return callback(null, newDoc);
			// });


		}else{
			//insert - sequelize
			Model.create(body)
			.then(function(newDoc){
				return callback(null, newDoc);
			})
			.catch(function(err){
				return callback({error: err, code: 500, message : "Erro ao salvar doc."});
			});

			//insert - mongoose
			// var p = new Model(body);
			// p.save(function(err, newDoc){
			// 	if(err)
			// 		return callback({error: err, code: 500, message : "Erro ao salvar doc."});

			// 	return callback(null, newDoc);

			// });
		}

	}catch(e){
		return callback({error: e, code: 400, message : "Erro ao salvar doc."});
	}

}

BaseModelController.prototype.remove = function(id, callback){

	var _handleError = function(err){
		logger.error("Error on remove document: " + err);
		var errObj = {error:err.toString(), code:500, message: "Error on remove document."};
		return callback(errObj);
	}

	try{

		//Remove - sequelize
		Model.findById(id)
		.then(function(doc){
			if(doc){
				doc.destroy().then(function(){

					return callback(null, doc);

				}).catch(function(err){
					return _handleError(err);
				});
			}else{
				return callback({error:"ID Not found", code:400, message: "ID Not found"});
			}
		})
		.catch(function(err){
			return _handleError(err);
		});

		//Remove - mongoose
		// Model.secureDelete(id, function(err, doc){
		// 	if(err)
		// 		return callback({error: err, code: 500, message : "Erro ao remover doc."});

		// 	return callback(null, doc);
		// });

	}catch(e){
		return callback({error: e, code: 400, message : "Erro ao remover doc."});
	}

}

module.exports = BaseModelController;

*/