var SequelizeClass = require('sequelize');
var sequelize = require('../dao/platformsequelize');

module.exports = sequelize.define("AppClient", {
	clientName : {
		type : SequelizeClass.STRING,
		allowNull : false,
		unique : true,
		field : 'client_name'
	},
	authSecret: {
		type : SequelizeClass.STRING,
		allowNull : false,
		field : 'auth_secret'
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
	tableName: 'tb_plat_app_client'
})