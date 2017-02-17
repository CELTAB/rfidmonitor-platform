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
* @namespace DynamicRoutes
*/

'use strict';
var Handlers = require(__base + 'routes/de/derouteshandlers');

var Route = require(__base + 'utils/customroute');
var dynamic = '/dynamic';

/**
* Contains the 5 operations for the Dynamic Entities management. Gets the metadata of one or every entity. Register a new entity. Activate or Deactivate an entity.
* @type {Array}
* @memberof DynamicRoutes
*/
var routes = [
    new Route('get', dynamic, Handlers.meta),
    new Route('get', dynamic + '/:entity', Handlers.meta),
    new Route('post', dynamic, Handlers.register),
    new Route('put', dynamic + '/:entity', Handlers.activate),
    new Route('delete', dynamic + '/:entity', Handlers.deactivate)
];

module.exports = routes;
