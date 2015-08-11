var SequelizeClass = require('sequelize');

var ClientEntitiesRaw = function(sequelize) {
  return sequelize.define("ClientEntitiesRaw", {
    entity: SequelizeClass.TEXT
  })	
}

module.exports = ClientEntitiesRaw;