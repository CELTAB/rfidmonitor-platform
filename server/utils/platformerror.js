var logger = require('winston');
var util = require('util');


//Reference: http://snak.tumblr.com/post/26546869908/creating-your-own-error-class-with-util-inherits

var PlatformError  = function(errorMessage){

	logger.error("Throwing error: " + errorMessage);
	return PlatformError.super_.call(this, errorMessage);
}

util.inherits(PlatformError, Error);

module.exports = PlatformError;