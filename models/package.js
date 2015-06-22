var logger = require('winston');

var Package = function(){

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof Package)) {
        logger.error('Error: Package constructor called without "new" operator');
        throw new Error('Package constructor called without "new" operator');
    }

    this.id = 0;
	this.package_hash = '';
	this.timestamp = new Date();
    this.package_size = '';
}

module.exports = Package;