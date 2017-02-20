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

/**
* Auxiliary class to handle hashes.
* @class
*/
var Hash = function() {

	var crypto = require('crypto');
	var SaltLength = 9;


	/**
	 * Genarates a complete hash: salt + md5
	 * @alias createHash
	 * @param  {String} password is the string to be hashed
	 * @return {String}          is the string's hash
	 * @memberof Hash
	 */
	var _createHash = function(password) {
		var salt = _generateSalt(SaltLength);
		var hash = _md5(password + salt);
		return salt + hash;
	}

	/**
	 * Checks if the given hash matches the given password string
	 * @alias validateHash
	 * @param  {String} hash     Hash for comparison.
	 * @param  {String} password Given string for comparison
	 * @return {Boolean}          True if matches or False otherwise.
	 * @memberof Hash
	 */
	var _validateHash = function(hash, password) {
		var salt = hash.substr(0, SaltLength);
		var validHash = salt + _md5(password + salt);
		return hash === validHash;
	}

	/**
	 * Generates a salt to concatenate with the hash.
	 * @alias generateSalt
	 * @param  {Number} len is the salt's string length
	 * @return {String}     is the salt.
	 * @memberof Hash
	 */
	var _generateSalt = function(len) {
		var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
		setLen = set.length,
		salt = '';
		for (var i = 0; i < len; i++) {
			var p = Math.floor(Math.random() * setLen);
			salt += set[p];
		}
		// return salt;
		return 'Z]s4NpW*'; //TODO remove static salt
	}

	/**
	* Generates a md5 hash from the given string.
	* @alias md5
	* @param  {String} string is the string to be hashed
	* @return {String}        is the md5 hash for the given string.
	* @memberof Hash
	*/
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
