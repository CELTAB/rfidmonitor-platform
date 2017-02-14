/****************************************************************************
**
** Copyright (C) 2015
**                     Gustavo Valiati <gustavovaliati@gmail.com>
**                     Thiago R. M. Bitencourt <thiago.mbitencourt@gmail.com>
**
** This file is part of the FishMonitoring project
**
** This program is free software; you can redistribute it and/or
** modify it under the terms of the GNU General Public License
** as published by the Free Software Foundation; version 2
** of the License.
**
** This program is distributed in the hope that it will be useful,
** but WITHOUT ANY WARRANTY; without even the implied warranty of
** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
** GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License
** along with this program; if not, write to the Free Software
** Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
**
****************************************************************************/

'use strict';
var SequelizeClass = require('sequelize');
var sequelize = require(__base + 'controller/database/platformsequelize');
var Collector = require(__base + 'models/collector');
var Package = require(__base + 'models/package');

/**
 * Entity definition for Rfiddata
 * @name Rfiddata
 * @class
 * @memberof SequelizeModels
 * @property {String} rfidCode holds the rfid identification. It is normally a code in decimal format.
 * @property {String} extraData holds JSON object with a variable structure. It is persisted as string.
 * @property {Date} rfidReadDate holds the date the rfid has been read in the collecting point.
 * @property {Date} serverReceivedDate holds the date the server have received the rfiddata.
 * @property {Number} collectorId holds the reference for the related Collector.
 * @property {Number} packageId holds the reference for the related Package.
 */
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
