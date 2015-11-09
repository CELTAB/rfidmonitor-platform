'use strict';
var SequelizeClass = require('sequelize');
var sequelize = require(__base + 'controller/database/platformsequelize');
var randomChars = require(__base + 'utils/randomchars');

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
			isIn : [['IMAGE', 'PDF', 'RFID_IMPORT']]
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
