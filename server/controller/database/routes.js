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

var logger = require('winston');
var PlatformError = require(__base + 'utils/platformerror');
var SeqUriRoute = require(__base + 'models/uriroute');

var Routes = function Routes(){
	var routesList = [];
	var methods = {
		GET: "GET",
		POST: "POST",
		PUT: "PUT",
		DELETE: "DELETE",
		ANY : "ANY"
	};

	this.getMethods = function(){
		return methods;
	}

	this.getRoutesList = function(){
		return routesList;
	}

	this.isMethodValid = function(method){
		return methods[method] ? true : false;
	}

	this.register = function(path, method){
		/* This function is able to receive only the String method, like:
				register('/any/path', methods.GET);
			And is also able to receive and option object to register all methods for the givern path, like:
				register('/any/path', {all: true});
		*/
		if (method && method.all === true) {
			this.register(path, methods.GET);
			this.register(path, methods.POST);
			this.register(path, methods.PUT);
			this.register(path, methods.DELETE);
			return;
		}

  	if(!this.isMethodValid(method))
  		return new PlatformError("Routes: Invalid method ["+method+"] to register on database.");

  	logger.debug("Registering route: [" + path + "] - [" + method + "]");

    SeqUriRoute
		.findOrCreate({where: {path: path, method: method}, defaults: {path: path, method: method}})
		.spread(function(route, created) {
			if(created){
				logger.debug("Route inserted on database: [" + path + "] - [" + method + "]");
			}else{
				logger.debug("Route already on database: [" + path + "] - [" + method + "]");
			}

			routesList.push({"id" : route.id, "path" : route.path , "method" : route.method });
		})
	}

	this.getRoutes = function(){
		return routesList;
	}

	logger.warn("Registering route path [ANY] method [ANY]");
	this.register('ANY','ANY');
    if(Routes.caller != Routes.getInstance){
        throw new PlatformError("This object cannot be instanciated");
    }
}

Routes.instance = null;
Routes.getInstance = function(){
  if(this.instance === null){
    this.instance = new Routes();
  }
  return this.instance;
}

module.exports = Routes.getInstance();
