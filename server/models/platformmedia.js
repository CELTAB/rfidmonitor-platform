'use strict';
var SequelizeClass = require('sequelize');
var sequelize = require(__base + 'controller/database/platformsequelize');

var model = sequelize.define("PlatformMedia", {
	url : {
		type : SequelizeClass.STRING,
		allowNull : false,
		unique: true
	},
	path : {
		type : SequelizeClass.STRING,
		allowNull : false,
		unique: true
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
			isIn : [['IMAGE', 'PDF', 'RFID_IMPORT']]
		}
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_platform_media'
});

module.exports = model;
