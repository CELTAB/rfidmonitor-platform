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
var Group = require(__base + 'models/group');

var model = sequelize.define("Collector", {
	name: {
		type : SequelizeClass.STRING,
		allowNull : false,
		unique: 'uq_name_mac',
		field : 'name'
	},
	lat: {
		type : SequelizeClass.STRING,
		allowNull : true,
		field : 'lat'
	},
	lng: {
		type : SequelizeClass.STRING,
		allowNull : true,
		field : 'lng'
	},
	mac: {
		type : SequelizeClass.STRING,
		allowNull : false,
		unique: 'uq_name_mac',
		field : 'mac'
	},
	description: {
		type : SequelizeClass.STRING,
		allowNull : true,
		field : 'description'
	},
	deletedAt : {
		type : SequelizeClass.DATE,
		unique: 'uq_name_mac'
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_collector',
	scopes:{
		byMac: function(macaddress){
			return{
				where: {mac: macaddress, deletedAt: null}
			}
		}
	},
	classMethods: {
		statusEnum: {
				ONLINE: 'ONLINE',
				OFFLINE: 'OFFLINE',
				UNKNOWN: 'UNKNOWN'
			}
	}
});

model.belongsTo(Group, {foreignKey: {name: 'groupId', allowNull: false}});
module.exports = model;
//OBJECT EXAMPLE
/*
{
	"name":"Aguas Bravas",
	"group_id":"1",
	"lat":"-25.432323",
	"lng":"-54.5807444",
	"mac":"8E-F3-81-5D-AD-E4",
	"description":"Canal de aguas bravas",
}
*/
