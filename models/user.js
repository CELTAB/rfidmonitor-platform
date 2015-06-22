var logger = require('winston');

var User = function(){

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof User)) {
        logger.error('Error: User constructor called without "new" operator');
        throw new Error('User constructor called without "new" operator');
    }

    this.id = 0;
	this.name = '';
	this.password = '';
	this.email = '';
    this.username = '';
}

module.exports = User;