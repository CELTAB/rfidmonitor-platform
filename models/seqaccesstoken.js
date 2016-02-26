var SequelizeClass = require('sequelize');
var sequelize = require('../dao/platformsequelize');

module.exports = sequelize.define("AccessToken", {
	value : {
		type : SequelizeClass.STRING,
		allowNull : false,
		field : 'value'
	},
	appClient: {
		type : SequelizeClass.INTEGER,
		allowNull : false,
		field : 'app_client_id',
		references: {
			model: 'tb_plat_app_client',
			key:   "id"
		}
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_access_token'
})