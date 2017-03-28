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
var logger = require('winston');
var fs = require('fs');
var path = require('path');
var appDir = path.dirname(require.main.filename);

/**
 * @namespace Utils
 */

/**
 * Clean up the restricted_media temporary folder.
 * @return {Error} Return null if no problem, and an error object if there is a problem.
 * @memberof Utils
 * @alias CleanRestrictedMedia
 */
var cleanRestrictedMediaTmpSync = function(){
	var dir = appDir + '/restricted_media/tmp/';

	fs.readdir(dir, function(err, files){
		if(err)
			return err;

		for(var i in files){
			var f = files[i];
			if(f != 'sample'){
				var finalPath = dir + f;
				logger.debug('Deleting file : ' + finalPath);
				try{
					fs.unlinkSync(finalPath);
				}catch(e){
					logger.error("Error while deleting file: " + finalPath + ". Error : " + e );
					return e;
				}
			}
		}
		return null; // sucess
	});
};

module.exports = cleanRestrictedMediaTmpSync;
