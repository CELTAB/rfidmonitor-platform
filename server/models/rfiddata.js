'use strict';
var SequelizeClass = require('sequelize');
var sequelize = require(__base + 'controller/database/platformsequelize');
var Collector = require(__base + 'models/collector');
var Package = require(__base + 'models/package');

var model = sequelize.define("Rfiddata", {
  rfidCode:{
    type : SequelizeClass.STRING,
    allowNull : false,
  },
  extraData:{
    type : SequelizeClass.STRING,
    allowNull : true
  },
  rfidReadDate:{
    type: SequelizeClass.DATE,
    allowNull: false
  },
  serverReceivedDate:{
    type: SequelizeClass.DATE,
    allowNull: false
  }
},
{
  paranoid : true,
  freezeTableName: true,
  tableName: 'tb_plat_rfiddata'
});

model.belongsTo(Collector, {foreignKey: {name: 'collectorId', allowNull: false}});
model.belongsTo(Package, {foreignKey: {name: 'packageId', allowNull: false}});
module.exports = model;

//OBJECT EXAMPLE - Is not possible to persiste RFIDData through http POST method
/*
{
  "rfidcode": 44332211,
  "rfidReadDate": "2014-10-15T15:58:33",
  "extraData":{},
  "collectorId":1,
  "packageId"
}
*/
