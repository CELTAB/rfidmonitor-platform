'use strict';
var SequelizeClass = require('sequelize');
var sequelize = require(__base + 'controller/database/platformsequelize');

var model = sequelize.define("UriRoute", {
	path : {
		type : SequelizeClass.STRING,
		allowNull : false,
		unique : 'uq_uriroute_path_method',
		field : 'path'
	},
	method: {
		type : SequelizeClass.ENUM('ANY', 'GET', 'POST', 'PUT', 'DELETE'),
		allowNull : false,
		unique : 'uq_uriroute_path_method',
		field : 'method'
	},
	deletedAt : {
		type : SequelizeClass.DATE,
		unique : 'uq_uriroute_path_method'
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_uri_route'
});

module.exports = model;
