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

/**
 * Entity definition for Package
 * @alias Package
 * @memberof SequelizeModels
 */
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
