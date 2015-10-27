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
