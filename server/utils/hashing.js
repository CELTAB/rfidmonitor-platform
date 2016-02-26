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
var Hash = function() {

	var crypto = require('crypto');
	var SaltLength = 9;

	var _createHash = function(password) {
	  var salt = _generateSalt(SaltLength);
	  var hash = _md5(password + salt);
	  return salt + hash;
	}

	var _validateHash = function(hash, password) {
	  var salt = hash.substr(0, SaltLength);
	  var validHash = salt + _md5(password + salt);
	  return hash === validHash;
	}

	var _generateSalt = function(len) {
	  var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
	      setLen = set.length,
	      salt = '';
	  for (var i = 0; i < len; i++) {
	    var p = Math.floor(Math.random() * setLen);
	    salt += set[p];
	  }
	  // return salt;
	  return 'Z]s4NpW*';
	}

	var _md5 = function(string) {
	  return crypto.createHash('md5').update(string).digest('hex');
	}

	return {
		md5: _md5,
		createHash: _createHash,
		validateHash: _validateHash,
		generateSalt: _generateSalt
	}
}();

module.exports = Hash;
