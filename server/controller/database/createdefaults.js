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

var User = sequelize.model('User');
var Group = sequelize.model('Group');

/**
 * Create a default group, admin user and a token with access to ANY route with ANY method, full access.
 * @param {Function} done callback for when done.
 * @class
 */
var CreateDefaults = function(done){
    /*
    If no active user is found it means that there's no way to access the system.
    So, it is needed to create a default User with Admin privileges.
    Create and admin user and a token with access to ANY route with ANY method, full access.
    */
    User.findAll({where:{deletedAt:null}}).then(function(result){
        if(result.length > 0){
            return createDefaultGroup(done);
        };

        createDefaultGroup(function(err){
            if(err) return done(err);

            return createDefaults(done);
        });
    });
};

/**
 * Finds for the default group, if not present, creates it.
 * @param  {Function} done callback for when done.
 * @return {callback_output}        returns the callback output.
 * @memberof CreateDefaults
 */
var createDefaultGroup = function(done){
    Group.findOne({where: {isDefault: true, deletedAt: null}})
    .then(function(group){
        if(!group){
            return defaultGroup(done);
        }

        return done();
    })
    .catch(function(e){
        logger.error('Error on find default Group: ' + e);
        return done(e);
    });
}

/**
 * Create default credentials for one can use the system as admin, at the first interaction
 * @param  {Function} done callback for when done.
 * @return {void}
 * @memberof CreateDefaults
 */
var createDefaults = function(done){
    //
    defaultUser(function(err, user){
        if(err) return done(err);
        defaultAppClient(user, function(err, appClient){
            if(err) return done(err);
            return grantAccessAny(appClient, done);
        });
    });
};

/**
 * Generic callback handler.
 * @param  {String}   when     action being handled.
 * @param  {Function} callback callback to be executed on success or error.
 * @return {callback_output}            returns the output from the callback.
 * @memberof CreateDefaults
 */
var handlers = function(when, callback){
    return {
        success: function(result){
            return callback(null, result);
        },
        error: function(err){
            logger.error('Error on Create default ' + when + ': ' + err);
            return callback(err);
        }
    }
};

/**
 * Creates the default Admin User and password
 * @param  {Function} done callback for when done.
 * @return {void}
 * @memberof CreateDefaults
 */
var defaultUser = function(done){
    var handler = handlers('User', done);
    var defaultUser = {name: 'Default Administrator', username: 'admin', password: 'admin', email:'invalid@email.com'};
    User.create(defaultUser).then(handler.success).catch(handler.error);
};

/**
 * Create the default app client with token to the default admin user
 * @param  {Object}   user reference user which the app client will be created.
 * @param  {Function} done callback for when done.
 * @return {void}
 * @memberof CreateDefaults
 */
var defaultAppClient = function(user, done){
    var AppClient = sequelize.model('AppClient');
    var handler = handlers('AppClient', done);
    var app = {description: 'Default appClient for ' + user.username, userId: user.id, def: true};
    AppClient.create(app).then(handler.success).catch(handler.error);
};

/**
 * Creates the permission that allow the given app client to access ANY route with ANY method
 * @param  {Object}   appClient the target app client
 * @param  {Function} done      callback for when done.
 * @return {void}
 * @memberof CreateDefaults
 */
var grantAccessAny = function(appClient, done){
    var Routes = sequelize.model('UriRoute');
    var Access = sequelize.model('RouteAccess');
    var handler = handlers('Access Grant', done);
    Routes.findOne({where: {path: 'ANY'}, method: 'ANY'})
    .then(function(route){
        //Create access to ANY route with ANY method
        var grantAccess = {appClient: appClient.id, uriRoute: route.id};
        Access.create(grantAccess).then(handler.success).catch(handler.error);
    })
    .catch(handler.error);
};

/**
 * Creates the default group
 * @param  {Function} done callback for when done
 * @return {void}
 * @memberof CreateDefaults
 */
var defaultGroup = function(done){
    var handler = handlers('Group', done);
    var defaultGroup = {name: 'Default Group', isDefault: true, description: 'Auto-generated Default Group'};
    Group.create(defaultGroup).then(handler.success).catch(handler.error);
};

module.exports = CreateDefaults;
