/****************************************************************************
**
** Copyright (C) 2016
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
var PlatformMedia = require(__base + 'models/platformmedia');

/**
 * Entity definition for RfidImport
 * @name RfidImport
 * @class
 * @memberof SequelizeModels
 * @property {Number} receivedPackages number of packets read from file.
 * @property {Number} receivedRfids number of rfiddatas read from file.
 * @property {Number} insertedPackages number of successfuly persisted packets.
 * @property {Number} insertedRfids number of successfuly persisted rfiddatas.
 * @property {Number} discardedByRepetitionPackagesNumber number of discarded packets due being already persisted.
 * @property {String} discardedByRepetitionPackagesList hash list of discarded packets that were discarded due being already persisted.
 * @property {Number} discardedByErrorPackagesNumber number of discarded packets due occuring an error while persisting.
 * @property {String} discardedByErrorPackagesList hash list of discarded packets that were discarded due occuring an error while persisting.
 * @property {Date} serverReceivedDate date and time of processing the file.
 * @property {Number} fileId is the reference to the uploaded file.
 */
var model = sequelize.define("RfidImport", {
  receivedPackages : {
    type : SequelizeClass.INTEGER,
    allowNull : false,
    defaultValue : 0
  },
  receivedRfids : {
    type : SequelizeClass.INTEGER,
    allowNull : false,
    defaultValue : 0
  },
  insertedPackages : {
    type : SequelizeClass.INTEGER,
    allowNull : false,
    defaultValue : 0
  },
  insertedRfids : {
    type : SequelizeClass.INTEGER,
    allowNull : false,
    defaultValue : 0
  },
  discardedByRepetitionPackagesNumber : {
    type : SequelizeClass.INTEGER,
    allowNull : false,
    defaultValue : 0
  },
  discardedByRepetitionPackagesList : {
    type : SequelizeClass.STRING,
    allowNull : true
  },
  discardedByErrorPackagesNumber : {
    type : SequelizeClass.INTEGER,
    allowNull : false,
    defaultValue : 0
  },
  discardedByErrorPackagesList : {
    type : SequelizeClass.STRING,
    allowNull : true
  },
  serverReceivedDate:{
    type: SequelizeClass.DATE,
    allowNull: false
  }
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_rfidimport'
});

model.belongsTo(PlatformMedia, {foreignKey: {name: 'fileId', allowNull: false}});
module.exports = model;
