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
var express = require('express');
var RoutingCore = require(__base + 'routes/routingcore');
var errorHandler = require(__base + 'utils/errorhandler');
var sequelize = require(__base + 'controller/database/platformsequelize');

/**
* Prepares the login and logout routes for the front-end user. Updates the Express router adding the new endpoints.
* @param {String} baseUri if informed, sets the route path preceding the /login and /logout endpoints
* @class
*/
var LoadLoginRoutes = function(baseUri){
    var router = express.Router();

    var routingCore = new RoutingCore(router, baseUri || '');

    //Handles the user login.
    var loginHandler = function(req, callback){
        if(!req.body.username || !req.body.password)
        return errorHandler('Missing username ou password', 400, callback);

        var UserCtrl = require(__base + 'controller/models/user'); //Needs to be here.
        UserCtrl.login(req.body, function(err, user){
            if(err){
                logger.error(err);
                return callback(err);
            }

            req.appSession.user = user;
            return callback(null, user);
        });
    };

    //Destroys the user's session, and request a redirect to the login page.
    var logoutHandler = function(req, callback){
        delete req.appSession.user;
        return callback(null, '/login', 'redirect');
    };

    /**
    * Returns whether there is an user's session.
    * @param  {Object}  req Express request object
    * @return {Boolean}     True if the user has a valid session. False otherwise.
    * @alias hasSession
    * @memberof LoadLoginRoutes
    */
    var _hasSession = function(req){
        // return true; //Uncomment to use on test enviroment
        return (req.appSession && req.appSession.user) ? true : false;
    };

    var Route = require(__base + 'utils/customroute');

    // The Anonymous attribute will get to the registerCustomRoute as a middler.
    var routes = [
        new Route('post', '/login', loginHandler, {anonymous: true}),
        new Route('post', '/logout', logoutHandler, {anonymous: true})
    ];

    routingCore.registerCustomRoute(routes);

    return {
        /**
        * Is the updated Express router object.
        * @type {Object}
        * @memberof LoadLoginRoutes
        */
        routes: router,
        hasSession: _hasSession
    };
};

module.exports = LoadLoginRoutes;
