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

/**
 * Entity definition for Group
 * @name Group
 * @class
 * @memberof SequelizeModels
 * @property {String} name Entity's unique identifier
 * @property {Boolean} isDefault defines if the entity is active
 * @property {String} description Entity's Sequelize model definition
 * @property {Date} deletedAt holds the deletion date, and by consequence defines if the register is soft-deleted.
 */
var model = sequelize.define("Group", {
	name: {
		type : SequelizeClass.STRING,
		allowNull : false,
		unique : 'uq_name',
		field : 'name'
	},
	isDefault: {
		type: SequelizeClass.BOOLEAN,
		defaultValue: null,
		unique : true
	},
	description: {
		type : SequelizeClass.STRING,
		allowNull : true,
		field : 'description'
	},
	deletedAt : {
		type : SequelizeClass.DATE,
		unique : 'uq_name'
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_group'
});

module.exports = model;

//OBJECT EXAMPLE
/*
{
	"name":"Itaipu",
	"description":"Grupo Itaipu Binacional",
	"isDefault":null
}
*/
