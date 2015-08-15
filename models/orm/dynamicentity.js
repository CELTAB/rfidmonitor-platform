var SequelizeClass = require('sequelize');
var sequelize = require('../../dao/platformsequelize');

module.exports = sequelize.define("DynamicEntity", {
	identifier : {
		type : SequelizeClass.STRING,
		unique: 'uq_identifier_and_deletedAt',
		allowNull : false
	},
	sequelizeModel: {
		type : SequelizeClass.TEXT,
		allowNull : true
	},
	sequelizeOptions: {
		type : SequelizeClass.TEXT,
		allowNull : true
	},
	original: {
		type : SequelizeClass.TEXT,
		allowNull : true
	},
	meta: {
		type : SequelizeClass.TEXT,
		allowNull : true
	},
	deletedAt : {
		type : SequelizeClass.DATE,
		unique : 'uq_identifier_and_deletedAt' //this enables having 1 unique identifier not deleted, and repeated identifiers deleted.
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_dynamic_entity'
})