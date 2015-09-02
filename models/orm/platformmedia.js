var SequelizeClass = require('sequelize');
var sequelize = require('../../dao/platformsequelize');

module.exports = sequelize.define("PlatformMedia", {
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
	type : {
		type : SequelizeClass.STRING,
		allowNull : false,
		validate : {
			isIn : [['IMAGE', 'PDF']]
		}
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_platform_media'
})