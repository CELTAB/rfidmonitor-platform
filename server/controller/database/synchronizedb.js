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
var DEModelPool = require(__base + 'controller/dynamic/demodelpool');
var sequelize = require(__base + 'controller/database/platformsequelize');
//bug
var pg = require('pg');
delete pg.native; //end - bug

/**
 * Functionality that loads from database every Sequelize model referent to Dynamic Entities.
 * This should happen very early on app startup, in order to have every model ready
 * for api requests.
 * @see DEModelPool
 * @class
 */
var SynchronizeDb = function() {
	/**
	 * Starts the database models synchronization.
	 * @alias start
	 * @param  {Function} done callback for when done.
	 * @return {void}        [description]
	 * @memberof SynchronizeDb
	 */
	var _start = function(done){
		var model = __base + 'models';
		// Load models definition to sequelize known then, and then synchronie
		require(model + '/group');
		require(model + '/collector');
		require(model + '/user');
		require(model + '/package');
		require(model + '/rfiddata');
		require(model + '/appclient');
		require(model + '/uriroute');
		require(model + '/routeaccess');
		require(model + '/dynamicentity');
		require(model + '/platformmedia');
		require(model + '/rfidimport');
		// sequelize.sync({force: true}).then(function(){
		sequelize.sync().then(function(){
			//Models synchronized. Call done with no errors (null).
			DEModelPool.loadDynamicEntities(function(error){
				if(error) return done(error);

				return done();
			});
		})
		.catch(function(error){

			/* TASK #2043
				The db user has readonly permissions, so the Sequelize will never succed on syncing.
				In this case, the database must have been manually imported from a dump.
				By that it is assumed the database structure is ready, and the permission error can be ignored.
				The error occurs because the Sequelize wants to "CREATE TABLE IF NOT EXISTS" to guarantee the table exists while syncing. As the role has no permissions
				for this kind of command, the db return the error code 42501.
			*/
			if(error.parent.code === "42501"){
				logger.warn("Controlled error happening: Permission denied for current schema. POSTGRES code 42501. This must only happen in case of db user being readonly and the db had manually imported. The app is continuing.");
				logger.debug("Controlled error happening: " + JSON.stringify(error));
				//Models synchronized. Call done with no errors (null).
				DEModelPool.loadDynamicEntities(function(error){
					if(error) return done(error);

					return done();
				});
			}else {
				logger.error("Error to synchronize sequelize models: " + error);
				done(error);
			}
		});
	}
	return{
		start: _start
	}
}();

module.exports = SynchronizeDb;
