'use strict';
var SequelizeClass = require('sequelize');
var sequelize = require(__base + 'controller/database/platformsequelize');
var User = require(__base + 'models/user');
var Tokenizer = require(__base + 'utils/randomchars');

var model = sequelize.define("AppClient", {
	token: {
		type : SequelizeClass.STRING,
		allowNull : false,
		unique : true,
		field : 'token'
	},
	description: {
		type : SequelizeClass.STRING,
		allowNull : false,
		field : 'description',
		set: function(desc){
      		this.setDataValue('description', desc);
      		this.setDataValue('token', Tokenizer.uid(32));
		}
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_app_client'
});

model.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}});
module.exports = model;

//OBJECT EXAMPLE
/*
{
	"user_id": 1,
	"description": "Any description here. Required."
}
*/
