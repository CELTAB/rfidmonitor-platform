var SequelizeClass = require('sequelize');
var sequelize = require('../../dao/platformsequelize');

module.exports = sequelize.define("SequelizeModel", {
	identifier : {
		type : SequelizeClass.STRING,
		unique: true
	},
	model: SequelizeClass.TEXT
})	