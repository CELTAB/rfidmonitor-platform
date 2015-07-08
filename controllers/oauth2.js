var logger = require('winston');
var oauth2orize = require('oauth2orize')
var User = require('../models/user');
var AppClient = require('../models/appclient');
var AccessToken = require('../models/accesstoken');
var AuthorizationCode = require('../models/authorizationcode');

var AppClientDao = require('../dao/appclientdao');
var appClientDao = new AppClientDao();
var AuthorizationCodeDao = require('../dao/authorizationcodedao');
var authCodeDao = new AuthorizationCodeDao();
var AccessTokenDao = require('../dao/accesstokendao');
var accessTokenDao = new AccessTokenDao();

var server = oauth2orize.createServer();

// Register serialialization function
server.serializeClient(function(client, callback) {
  return callback(null, client.id);
});

// Register deserialization function
server.deserializeClient(function(id, callback) {
	appClientDao.getById(id, function (err, client) {
		if (err) { return callback(err); }
		return callback(null, client);
	});
});

// Register authorization code grant type
server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, callback) {
  
	// Create a new authorization code
	var code = new AuthorizationCode();
	code.value = uid(16);
	code.redirectUri = redirectUri;
	code.userId = user.id;

	// Save the auth code and check for errors
	authCodeDao.insert(code, function(err, id) {
		if (err) { return callback(err); }

		callback(null, code.value);
	});
}));

// Exchange authorization codes for access tokens
server.exchange(oauth2orize.exchange.code(function(client, code, redirectUri, callback) {
	logger.debug('server.exchange : client= ' + JSON.stringify(client) + ' code=' + code + ' uri= ' + redirectUri);
	authCodeDao.getByValue(code, function (err, authCode) {
		logger.debug('server.exchange : authCode = ' + JSON.stringify(authCode));
		if (err) { return callback(err); }
		if (authCode === undefined || authCode === null ) { return callback(null, false); }
		logger.warn("FIX THIS");
		// if (client.id !== authCode.clientId) { return callback(null, false); } // WARNING may not work because we changed 'client._id.toString()' for this 'client.id'. Or yes. TODO remove  this comment if working.
		if (redirectUri !== authCode.redirectUri) { return callback(null, false); }

		// Delete auth code now that it has been used
		authCodeDao.deleteById(authCode.id, function (err) {
			if(err) { return callback(err); }

			// Create a new access token
			var token = new AccessToken();
			token.value = uid(256);
			token.userId = authCode.userId;


			// Save the access token and check for errors
			accessTokenDao.insert(token, function (err, id) {
				if (err) { return callback(err); }
				token.id = id;
				callback(null, token);
			});			
		});														
	});
}));

function uid (len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// User authorization endpoint
exports.authorization = [
	server.authorization(function(clientId, redirectUri, callback) {

		appClientDao.getByOauthId(clientId, function (err, client) {
			if (err) { return callback(err); }

			return callback(null, client, redirectUri);
		});
	}),
	function(req, res){
		res.render('tmp_dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
	}
]

// User decision endpoint
exports.decision = [
  server.decision()
]

// Application client token exchange endpoint
exports.token = [
  server.token(),
  server.errorHandler()
]
