var logger = require('winston');
var ManipulateDb = require('./manipulatedb');

var InitiateDb = function() {

	var _manipulate = new ManipulateDb();

	this.start = function(){
		_manipulate.testConnection(function(){

			var AppClient = require('../models/appclient');
			var AppClientDao = require('../dao/appclientdao');

			var AccessToken = require('../models/accesstoken');
			var AccessTokenDao = require('../dao/accesstokendao');

			var client = new AppClient();
			appClientDao =  new AppClientDao();
			appClientDao.getByName("Default Client", function(err, defaultClient){

				if(err) return;

				if(defaultClient) return logger.info("Default appClient already exists");

				client.clientName = "Default Client";
				client.authSecret = "defaultsecret";
				client.description = "Default client inserted on every start-up";

				appClientDao.insert(client, function(err, clientId){
					if(err){
						return;
					}

					// Create a new access token
					var token = new AccessToken();
					token.value = "defaulttokenaccess";
					token.appClientId = clientId;

					logger.info("Default appClient created with ID " + clientId);

					var tokenDao = new AccessTokenDao();
					tokenDao.insert(token, function(err, tokenId){

						if(err) return logger.error("Error on create token for default appClient");
						logger.info("Default token for appClient: " + token.value);
					});
				});
			});
		});
	}

	return{
		start: start
	}
}();

var resultToArray = function(){

	this.toArray = function(toSpecificObject, resultArray){

	    if(resultArray.length == 0)
	        return [];

	    var objArray = [];
	    for (var i in resultArray) {
	      val = resultArray[i];
	      objArray.push(toSpecificObject(val));
	    }
	    return objArray;
	}

	return{
		toArray: toArray
	}
}();

var RandomChars = function() {

	this.randomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	this.uid = function(len) {
		var buf = []
    	, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    	, charlen = chars.length;

		for (var i = 0; i < len; ++i) {
			buf.push(chars[this.randomInt(0, charlen - 1)]);
		}

		return buf.join('');
	}

	return {
		uid: uid,
		randomInt: randomInt
	}
}();

exports.randomChars = RandomChars;
exports.resultToArray = resultToArray;
exports.InitiateDb = InitiateDb;