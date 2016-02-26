'use strict';
var SequelizeClass = require('sequelize');
var sequelize = require(__base + 'controller/database/platformsequelize');

var model = sequelize.define("Package", {
  packageHash:{
    type: SequelizeClass.STRING,
    allowNull : false,
    unique: true
  },
  packageSize:{
    type: SequelizeClass.INTEGER,
    allowNull : false
  }
},
{
  paranoid : true,
  freezeTableName: true,
  tableName: 'tb_plat_package'
});

module.exports = model;
