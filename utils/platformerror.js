var logger = require('winston');

var PlatformError  = function(errorMessage){

	logger.error("Throwing error: " + errorMessage);
	throw new Error(errorMessage);
}

module.exports = PlatformError;