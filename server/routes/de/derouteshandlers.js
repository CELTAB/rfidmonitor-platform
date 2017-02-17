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
var sequelize = require(__base + 'controller/database/platformsequelize');
var DynamicEntity = sequelize.model('DynamicEntity');
var deModelPool = require(__base + 'controller/dynamic/demodelpool');
var errorHandler = require(__base + 'utils/errorhandler');

/**
* Provides the handling for the dynamic entities management.
* @return {Object} Object containing 4 functions: activate, deactivate, meta, register.
* @name DERoutesHandler
* @class
*/
var handlers = function() {

    /**
    * Retrieve one dynamic entity from database
    * @param  {Object}   req      Express request object.
    * @param  {Function} callback callback for when ready. Receives two parameters, first as error and second as the result object.
    * @return {void}
    * @memberof DERoutesHandler
    */
    var getEntity = function(req, callback) {
        if(!deModelPool.getModel(req.params.entity))
        return errorHandler('Invalid Entity.', 400, callback);

        DynamicEntity.findOne({
            where: { identifier: req.params.entity}
        })
        .then(function(entity){
            if(!entity)
            return errorHandler('Invalid Entity.', 400, callback);

            return callback(null, entity);
        })
        .catch(function(e){
            return errorHandler(500, e.toString(), callback);
        });
    };

    /**
    * Retrieve all the dynamic entities from database
    * @param  {Object}   req      Express request object.
    * @param  {Function} callback callback for when ready. Receives two parameters, first as error and second as the result object.
    * @return {void}
    * @memberof DERoutesHandler
    */
    var getAllEntities = function(req, callback) {
        //Verifies access level to only return the entity that the user is allowed to.
        var query = req.query;
        var UriRoute = sequelize.model('UriRoute');
        /* Steps:
        - + Search routes that represents dynamics entities
        - + Search on route access table for whitch of those routes are allowed for the given token
        - + Search for dynamic antities that has relation with the allowed routes found
        - + Algorithm successfuly accomplished
        */
        UriRoute.findAll({attributes:["path"], where:{path:{$like: "/api/dao/%"}}, group: 'path'})
        .then(function(routes) {
            if (!routes.length)
            return callback(null, {count: 0, rows: routes});

            var routes = routes.map(function(route) { return route.path; });
            routes.push("ANY"); //Add the ANY access level
            var RouteAccess = sequelize.model('RouteAccess');
            RouteAccess.findAll(
                {
                    where : { appClient: req.user.clientId},
                    include: [
                        {
                            model: UriRoute,
                            where: {
                                path: {$in: routes},
                                method : { $or : ['ANY', 'GET']}
                            }
                        }
                    ]
                }
            )
            .then(function(entities){
                if (!entities.length)
                return callback(null, {count: 0, rows: entities});

                // if(entities.some(ent => ent.UriRoute.path === 'ANY')) { //ECMAScript 6
                if(!entities.some(function(ent){return ent.UriRoute.path === 'ANY';})) {
                    var identifiers = entities.map(function(ent) {
                        if (ent.UriRoute.path !== 'ANY')
                        return ent.UriRoute.path.split('/')[3];
                    });
                    query.where = query.where || {};
                    query.where.identifier = {$in: identifiers};
                }
                DynamicEntity.findAndCountAll(query)
                .then(function(entities){
                    return callback(null, entities);
                })
                .catch(function(e){
                    return errorHandler(e.toString(), 500, callback);
                });
            })
            .catch(function(e){
                return errorHandler(e.toString(), 500, callback);
            });
        })
        .catch(function(e) {
            return errorHandler(e.toString(), 500, callback);
        });
    };

    //Update the entity to activate or deactivate it

    /**
    * Update the given entity setting its status (active/inactive) as requested.
    * @param  {Object}   req      Express request object.
    * @param  {Boolean}   value    Defines the active status.
    * @param  {Function} callback callback for when ready. Receives two parameters, first as error and second as the result object.
    * @return {void}
    * @memberof DERoutesHandler
    */
    var updateEntity = function(req, value, callback) {
        getEntity(req, function(err, entity) {
            if(err) return callback(err);

            entity.active = value;
            entity.save().then(function(ok){
                return callback(null, {"message" : "OK"});
            });
        });
    };

    /**
    * Retrieves the meta data for every entity or a specific one. GET method for the dynamic entities.
    * @alias meta
    * @param  {Object}   req      Express request object.
    * @param  {Function} callback callback for when ready. Receives two parameters, first as error and second as the result object.
    * @return {void}
    * @memberof DERoutesHandler
    */
    var metaHandler = function(req, callback) {
        var query = null;
        if (req.query && req.query.q) {
            try {
                query = JSON.parse(req.query.q);
            }catch(e) {
                return errorHandler('Invalid query', 400, callback);
            }
        }
        var getOriginal = query && query.original === true;

        if (req.params.entity) {
            getEntity(req, function(err, entity) {
                if(err) return callback(err);

                if (getOriginal) {
                    var response = JSON.parse(entity.original);
                    response.active = entity.active;
                    return callback(null, response);
                }
                return callback(null, JSON.parse(entity.meta));
            });
        } else {
            var qr = getOriginal ?
            {attributes : ['original', 'active']} :
            {attributes : ['meta'], where: {active: true}};

            req.query = qr;
            getAllEntities(req, function(err, result) {
                if (err) return callback(err);

                var entities = result.rows;
                var response = [];
                if (getOriginal) {
                    for(var i in entities){
                        var enti = entities[i].original;
                        enti = JSON.parse(enti);
                        enti.active = entities[i].active;
                        response.push(enti);
                    }
                } else {
                    for(var i in entities){
                        response.push(JSON.parse(entities[i].meta));
                    }
                }
                result.rows = response;
                return callback(null, result);
            });
        }
    };

    /**
    * Register a new dynamic entity in the platform, using as parameter the given specification. POST method to crate a new dynamic entity.
    * @alias register
    * @param  {Object}   req      Express request object.
    * @param  {Function} callback callback for when ready. Receives two parameters, first as error and second as the result object.
    * @return {void}
    * @memberof DERoutesHandler
    */
    var registerHandler = function(req, callback) {
        var dynamicEntities = new (require(__base + 'controller/dynamic/dynamicentities'))();
        dynamicEntities.registerEntity(req.body, function(errors){
            if(errors)
            return callback({code: 500, error: errors, message: 'Error on save dynamic entity'});
            return callback(null, {"message" : "OK"});
        });
    };

    /**
    * Change the given entity status to active. PUT method that allows activate an deactivated (deleted) entity.
    * @alias activate
    * @param  {Object}   req      Express request object.
    * @param  {Function} callback callback for when ready. Receives two parameters, first as error and second as the result object.
    * @return {void}
    * @memberof DERoutesHandler
    */
    var activeHandler = function(req, callback){
        return updateEntity(req, true, callback);
    };

    /**
    * Change the given entity status to inactive. DELETE method that actually deactivate a dynamic entity.
    * @alias deactivate
    * @param  {Object}   req      Express request object.
    * @param  {Function} callback callback for when ready. Receives two parameters, first as error and second as the result object.
    * @return {void}
    * @memberof DERoutesHandler
    */
    var deactivateHandler = function(req, callback) {
        return updateEntity(req, false, callback);
    };

    return {
        activate: activeHandler,
        deactivate: deactivateHandler,
        meta: metaHandler,
        register: registerHandler
    };
};

module.exports = handlers();
