var SequelizeClass = require('sequelize');

var ClientObjRaw = function(sequelize) {
  return sequelize.define("ClientObjRaw", {
    obj: SequelizeClass.TEXT
  })	
}

module.exports = ClientObjRaw;