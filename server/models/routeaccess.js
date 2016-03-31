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
var SequelizeClass = require('sequelize');
var sequelize = require(__base + 'controller/database/platformsequelize');
var UriRoute = require(__base + 'models/uriroute');
var AppClient = require(__base + 'models/appclient');

var model = sequelize.define("RouteAccess", {
	appClient: {
		type : SequelizeClass.INTEGER,
		allowNull : false,
		field : 'appClient',
		unique : 'uq_app_route',
		references: {
			model: AppClient,
			key:   "id"
		}
	},
	uriRoute: {
		type : SequelizeClass.INTEGER,
		allowNull : false,
		field : 'uriRoute',
		unique : 'uq_app_route',
		references: {
			model: UriRoute,
			key:   "id"
		}
	},
	deletedAt : {
		type : SequelizeClass.DATE,
		unique : 'uq_app_route'
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_route_access'
});

model.belongsTo(AppClient, {foreignKey : {name: 'appClient', allowNull: false}});
model.belongsTo(UriRoute, {foreignKey : {name: 'uriRoute', allowNull: false}});
module.exports = model;

//OBJECT EXAMPLE
/*
{
	"appClient": 1,
	"uriRoute":1
}
*/
