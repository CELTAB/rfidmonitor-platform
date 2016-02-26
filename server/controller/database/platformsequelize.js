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

var logger = require('winston');
var Sequelize = require('sequelize');

var PlatformSequelize = function PlatformSequelize(){
	var connectionString = 'postgres://rfidplatform:rfidplatform@localhost:5432/rfidplatform';
	var sequelize = new Sequelize(connectionString, {logging : false});

	this.getSequelize = function(){
		return sequelize;
	}
  if(PlatformSequelize.caller != PlatformSequelize.getInstance){
      throw new PlatformError("This object cannot be instanciated");
  }
}

PlatformSequelize.instance = null;
PlatformSequelize.getInstance = function(){
  if(this.instance === null){
		logger.silly('Initializing Platform Sequelize');
    this.instance = new PlatformSequelize();
  }
  return this.instance;
}

module.exports = PlatformSequelize.getInstance().getSequelize();
