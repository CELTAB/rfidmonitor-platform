'use strict';
var SequelizeClass = require('sequelize');
var sequelize = require(__base + 'controller/database/platformsequelize');
var Hash = require(__base + 'utils/hashing');

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
			attributes : ['id', 'username', 'password', 'email'],
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
