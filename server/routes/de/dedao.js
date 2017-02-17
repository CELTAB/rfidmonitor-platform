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

/**
* @namespace DeDAO
*/

'use strict';
var logger = require('winston');
var deModelPool = require(__base + 'controller/dynamic/demodelpool');
var errorHandler = require(__base + 'utils/errorhandler');

/**
 * Receives a callback as parameter, and return two functions, one for success handling and another for error.
 * The error handling function, receives an error as parameter, and calls the errorHandler, setting a error string, and a default 500 code response.
 * The success handling function, receives an response as paramter, and processes the result from database. It customize the response objects
 * to an api pattern.
 * @param  {Function} callback is the callback used in the handling functions.
 * @return {Object}            With 2 attributes functions {success: function(), error: function()}
 * @memberof DeDAO
 */
var promisesHandler = function(callback){
    var _cb = callback;
    var embeddedEntityRename = function(obj) {
        var attrName = null;
        for (var attr in obj) {
            if (attr.indexOf("_group_id") != -1) {
                attrName = attr.replace("_group_id", "");
            }
        }
        return attrName;
    };
    return{
        success: function(result){
            var records = result && result.rows || result;
            if(Array.isArray(records)) {
                var response = [];
                records.forEach(function(el) {
                    var elB = el.get({plain: true});
                    if(el.Group) {
                        elB[embeddedEntityRename(elB)] = elB.Group;
                        delete elB.Group;
                    }
                    response.push(elB);
                });
                result.rows = response;
                return _cb(null, result);
            }
            if(!records){
                return errorHandler('Record not found', 400, _cb);
            }
            var elB = records.get({plain: true});
            if(records.Group) {
                elB[embeddedEntityRename(elB)] = elB.Group;
                delete elB.Group;
            }
            return _cb(null, elB);
        },
        error: function(err){
            return errorHandler(err.toString(), 500, _cb);
        }
    }
};

/**
* Is a middleware that is going to handle a get all or get by id request from the client.
* Get the entity identifier parameter from the uri path, and acquire the model by the identifier given.
* Find the registers by getting its id by the parameter in the uri path or a Sequelize Query from the request query.
* @param  {Object}   req      Express request object
* @param  {Function} callback callback for when done.
* @return {void}
* @memberof DeDAO
*/
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
        model.findAndCountAll(query || {}).then(promises.success).catch(promises.error);
    }else{
        query = query || {};
        query.where = {id: req.params.id};
        model.findOne(query).then(promises.success).catch(promises.error);
    }
}

/**
* Is a middleware that is going to handle a post request from the client.
* Get the entity identifier parameter from the uri path, and acquire the model by the identifier given.
* Creates a newregister using the body object from the request
* @param  {Object}   req      Express request object
* @param  {Function} callback callback for when done.
* @return {void}
* @memberof DeDAO
*/
var postHandler = function(req, callback){
    var model = deModelPool.getModel(req.params.entity);
    if(!model)
        return errorHandler('Invalid Entity', 400, callback);

    var promises = promisesHandler(callback);
    model.create(req.body).then(promises.success).catch(promises.error);
}

/**
* Is a middleware that is going to handle a put request from the client.
* Get the entity identifier parameter from the uri path, and acquire the model by the identifier given.
* Find the register by getting its id by the parameter in the uri path.
* Update the register using the body object from the request
* @param  {Object}   req      Express request object
* @param  {Function} callback callback for when done.
* @return {void}
* @memberof DeDAO
*/
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

/**
* Is a middleware that is going to handle a delete request from the client.
* Get the entity identifier parameter from the uri path, and acquire the model by the identifier given.
* Find the register by getting its id by the parameter in the uri path.
* Finally softly delete the register.
* @param  {Object}   req      Express request object
* @param  {Function} callback callback for when done.
* @return {void}
* @memberof DeDAO
*/
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
            return callback(null, entity);
        })
        .catch(promises.error);
    }).catch(promises.error);
}

var Route = require(__base + 'utils/customroute');

/**
* Is the route root for the generics routes.
* @type {String}
* @memberof DeDAO
*/
var routeStr = '/dao/:entity';

/**
* Holds the list of generic routes available for any dynamic entity. List a generic get all, get by id, post, put and delete.
* @type {Array}
* @memberof DeDAO
*/
var routes = [
    new Route('get', routeStr, getHandler, {anonymous: true}),
    new Route('get', routeStr + '/:id', getHandler, {anonymous: true}),
    new Route('post', routeStr, postHandler, {anonymous: true}),
    new Route('put', routeStr + '/:id', putHandler, {anonymous: true}),
    new Route('delete', routeStr + '/:id', deleteHandler, {anonymous: true})
];

module.exports = routes;
