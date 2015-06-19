var logger = require('../logs').Logger;

var Group = function(){

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof Group)) {
        logger.warn('Warning: Group constructor called without "new" operator');
    }

    this.id;
	this.name = '';
	this.creation_date = new Date();
    this.description = '';
}

module.exports = Group;