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
var randomChars = require(__base + 'utils/randomchars');

/**
 * Entity definition for PlatformMedia
 * @name PlatformMedia
 * @class
 * @memberof SequelizeModels
 * @property {String} url holds the route to acesses the resource
 * @property {String} path is the file system path
 * @property {String} description description of the file
 * @property {String} mimetype file's mime type
 * @property {String} type file's application type. Must be one of: IMAGE, FILE, RFID_IMPORT .
 * @property {String} uuid is an unique key to identify the resource
 */
var model = sequelize.define("PlatformMedia", {
	url : {
		type : SequelizeClass.STRING,
		allowNull : false,
		unique: true
	},
	path : {
		type : SequelizeClass.STRING,
		allowNull : false,
		unique: true,
		set: function(path){
			this.setDataValue('path', path);
			this.setDataValue('uuid', randomChars.uid(64));
		}
	},
	description : {
		type : SequelizeClass.STRING
	},
	mimetype : {
		type : SequelizeClass.STRING,
		allowNull : false
	},
	type : {
		type : SequelizeClass.STRING,
		allowNull : false,
		validate : {
			isIn : [['IMAGE', 'FILE', 'RFID_IMPORT']]
		}
	},
	uuid: {
		type: SequelizeClass.STRING,
		allowNull: false,
		unique: true
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_platform_media'
});

module.exports = model;
