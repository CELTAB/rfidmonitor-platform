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
var Hash = require(__base + 'utils/hashing');

/**
 * Entity definition for User
 * @name User
 * @class
 * @memberof SequelizeModels
 * @property {STRING} name the user's name.
 * @property {STRING} email the user's email.
 * @property {STRING} username the user's system name.
 * @property {STRING} password the user's password.
 */
var model = sequelize.define("User", {
	name:{
		type: SequelizeClass.STRING,
		allowNull: false
	},
	email:{
		type: SequelizeClass.STRING,
		allowNull: false,
		validate:{
			isEmail: true
		}
	},
	username: {
		type : SequelizeClass.STRING,
		allowNull : false,
		unique : true
	},
	password: {
		type: SequelizeClass.STRING,
		allowNull: false,
		set: function(pass){
			this.setDataValue('password', Hash.createHash(pass));
		}
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_user',
	defaultScope:
		{
			attributes : ['id', 'name', 'username', 'email'],
			where: { deletedAt: null }
		},
	scopes:{
		loginScope: {
			attributes : ['id', 'username', 'name', 'password', 'email'],
			where: { deletedAt: null}
		}
	},
	instanceMethods: {
    	clean: function()  {
    		var objUser = {};
    		objUser.id = this.getDataValue('id');
    		objUser.name = this.getDataValue('name');
    		objUser.email = this.getDataValue('email');
    		objUser.username = this.getDataValue('username');
				objUser.token = this.token || undefined;
				objUser.routes = this.routes || [];
    		return objUser;
    	},
    	isPasswordValid: function(pass){
    		var match = Hash.createHash(pass) == this.getDataValue('password');
    		return match;
    	}
  	}
});

module.exports = model;

//OBJECT EXAMPLE
/*
{
	"name":"Jaime",
	"email":"jaiminho@correios.com.br",
	"username":"jaiminho",
	"password":"jaiminho"
}
*/
