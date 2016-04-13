/****************************************************************************
**
** Copyright (C) 2015
**                     Gustavo Valiati <gustavovaliati@gmail.com>
**                     Thiago R. M. Bitencourt <thiago.mbitencourt@gmail.com>
**
** This file is part of the FishMonitoring project
**
** This program is free software; you can redistribute it and/or
** modify it under the terms of the GNU General Public License
** as published by the Free Software Foundation; version 2
** of the License.
**
** This program is distributed in the hope that it will be useful,
** but WITHOUT ANY WARRANTY; without even the implied warranty of
** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
** GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License
** along with this program; if not, write to the Free Software
** Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
**
****************************************************************************/

'use strict';
var logger = require('winston');

var BaseModelController = function(model, modelName){

	var _constructRegister = function(model, modelName){
		var _Model = model;
		var _modelName = modelName;
		logger.silly("USE _modelName (" + _modelName + ") for logging purpouse");
		logger.debug("Prepare default controller for " + _modelName);

		var _handleError = function(err, operation, callback){
			var errMessage = 'Error on ' + operation + ' document.';
			logger.error(errMessage + err);
			var errObj = {error: err.toString(), code: 500, message : errMessage};
			return callback(errObj);
		}

		var _find = function(id, query, callback){
			var operation = 'find'; //Use for log purspouse. See _handleError function
			try{
				if(!query)
					query = {};

				// query.include = query.include || [{all: true}];
				if(id){
					//findById
					_Model.findById(id, query)
					.then(function(doc){
						return callback(null, doc);
					})
					.catch(function(err){
						return _handleError(err, operation, callback);
					});
				}else{
					//find all
					// return callback(null, query);
					_Model.findAndCountAll(query).then(function(docs){
						return callback(null, docs);
					}).catch(function(err){
						return _handleError(err, operation, callback);
					});
				}
			}catch(err){
				return _handleError(err, operation, callback);
			}
		};

		var _save = function(body, callback){
			var operation = 'save'; //Use for log purspouse. See _handleError function
			try{
				delete body.deletedAt;

				if(body._id || body.id){
					var id = body._id || body.id;
					delete body._id;
					delete body.id;

					_Model.findById(id)
					.then(function(doc){
						if(doc){
							doc.update(body).then(function(newDoc){
								return callback(null, newDoc);
							}).catch(function(err){
								return _handleError(err, operation, callback);
							});
						}else{
							return callback({error:"ID Not found", code:400, message: "ID Not found"});
						}
					})
					.catch(function(err){
						return _handleError(err, operation, callback);
					});
				}else{
					_Model.create(body)
					.then(function(newDoc){
						return callback(null, newDoc);
					})
					.catch(function(err){
						return _handleError(err, operation, callback);
					});
				}

			}catch(err){
				return _handleError(err, operation, callback);
			}

		};

		var _remove = function(id, callback){
			var operation = 'remove'; //Use for log purspouse. See _handleError function
			try{
				_Model.findById(id)
				.then(function(doc){
					if(doc){
						doc.destroy().then(function(){
							return callback(null, doc);
						}).catch(function(err){
							return _handleError(err, operation, callback);
						});
					}else{
						return callback({error:"ID Not found", code:400, message: "ID Not found"});
					}
				})
				.catch(function(err){
					return _handleError(err, operation, callback);
				});
			}catch(e){
				return callback({error: e, code: 400, message : "Error on remove document."});
			}
		}

		return{
			find: _find,
			save: _save,
			remove: _remove,
			name: _modelName,
			custom: {},
			customRoute: [],
			isValid: function(){
				return true;
			}
		}
	};

	return _constructRegister(model, modelName);
}

module.exports = BaseModelController;
