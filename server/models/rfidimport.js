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
