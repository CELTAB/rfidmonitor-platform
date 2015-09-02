var SequelizeClass = require('sequelize');
var sequelize = require('../dao/platformsequelize');

module.exports = sequelize.define("User", {
	name : {
		type : SequelizeClass.STRING,
		allowNull : false
	},
	email: {
		type : SequelizeClass.STRING,
		allowNull : false
	},
	username: {
		type : SequelizeClass.STRING,
		allowNull : false,
		unique: true		
	},
	password: {
		type: SequelizeClass.STRING,
		allowNull: false
	},
	loginAllowed: {
		type: SequelizeClass.BOOLEAN
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_user'
})