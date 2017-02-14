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

/**
* Instances of the BaseModelController
* @namespace ModelControllers
*/


/**
 * Class that provides a default implementation of CRUD functions, for an given Sequelize model.
 * @param {Object} model     is the Sequelize Model.
 * @param {String} modelName the model name.
 * @class
 * @memberof ModelControllers
 */
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

		/**
		 * Implements: find by id and find all registers of the given model.
		 * @alias find
		 * @param  {Number}   id       is the register id. If null, the find all will be used.
		 * @param  {Object}   query    is a Sequelize query from the native API.
		 * @param  {Function} callback callback for when done, that receives 2 parameters:
		 * first error and the second is the objects found.
		 * @return {void}
		 * @memberof BaseModelController
		 */
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

		/**
		 * Implements: save and update a register of the given model.
		 * @alias save
		 * @param  {Object}   body     contains the entity attributes within the values.
		 * @param  {Function} callback callback for when done, that receives 2 parameters:
		 * first error and the second is the object inserted or updated.
		 * @return {void}
		 * @memberof BaseModelController
		 */
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


		/**
		 * Implements: find by id or find all register of the given model.
		 * @alias remove
		 * @param  {Number}   id       the id of the register that will be removed.
		 * @param  {Function} callback callback callback for when done, that receives 2 parameters:
		 * first error and the second is the objects found.
		 * @return {void}
		 * @memberof BaseModelController
		 */
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
			/**
			 * Holds a map of custom methods for current model.
			 * @type {Object}
			 * @memberof BaseModelController
			 */
			custom: {},
			/**
			 * Holds an array of custom routes wanted for the current model.
			 * @type {Array}
			 * @see Routes
			 * @memberof BaseModelController
			 */
			customRoute: [],
			/**
			 * Unspecified function.
			 * @return {Boolean} valid or not.
			 * @deprecated
			 * @memberof BaseModelController
			 */
			isValid: function(){
				return true;
			}
		}
	};

	return _constructRegister(model, modelName);
}

module.exports = BaseModelController;
