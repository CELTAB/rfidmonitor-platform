var SequelizeClass = require('sequelize');
var sequelize = require(__base + 'controller/platformsequelize');

var model = sequelize.define("Group", {
	name: {
		type : SequelizeClass.STRING,
		allowNull : false,
		unique : 'uq_name',
		field : 'name'
	},
	isDefault: {
		type: SequelizeClass.BOOLEAN,
		defaultValue: null,
		unique : true
	},
	description: {
		type : SequelizeClass.STRING,
		allowNull : true,
		field : 'description'
	},
	deletedAt : {
		type : SequelizeClass.DATE,
		unique : 'uq_name'
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_group'
});

module.exports = model;

//OBJECT EXAMPLE
/*
{
	"name":"Itaipu",
	"description":"Grupo Itaipu Binacional",
	"isDefault":null	
}
*/	