var SequelizeClass = require('sequelize');
var sequelize = require('../../dao/platformsequelize');

module.exports = sequelize.define("SequelizeModel", {
	identifier : {
		type : SequelizeClass.TEXT,
		unique: true
	},
	model: SequelizeClass.TEXT
})	