var SequelizeClass = require('sequelize');
var sequelize = require('../../dao/platformsequelize');

module.exports = sequelize.define("ClientEntitiesRaw", {
	entity: SequelizeClass.TEXT,
	identifier : {
		type : SequelizeClass.STRING,
		unique: true
	}
})