var SequelizeClass = require('sequelize');
var sequelize = require('../../dao/platformsequelize');

module.exports = sequelize.define("SequelizeModel", {
	identifier : {
		type : SequelizeClass.STRING,
		unique: true,
		allowNull : false
	},
	model: {
		type : SequelizeClass.TEXT,
		allowNull : false
	},
	options: {
		type : SequelizeClass.TEXT,
		allowNull : false
	}
})	