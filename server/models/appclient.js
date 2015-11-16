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
		field : 'description'
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_app_client',
	hooks: {
          beforeValidate: function (app) {
							if(!app.token)
								app.token = Tokenizer.uid(32);
          }
        }
});

model.belongsTo(User, {foreignKey: {name: 'userId', allowNull: false}});
module.exports = model;

//OBJECT EXAMPLE
/*
{
	"userId": 1,
	"description": "Any description here. Required."
}
*/
