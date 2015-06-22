var logger = require('winston');

var Group = function(){

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof Group)) {
        logger.error('Error: Group constructor called without "new" operator');
        throw new Error('Group constructor called without "new" operator');
    }

    this.id = 0;
	this.name = '';
	this.creation_date = new Date();
    this.description = '';
    this.isdefault = null;
}

module.exports = Group;