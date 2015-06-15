var Group = function(){

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof Group)) {
        console.warn('Warning: Group constructor called without "new" operator');
    }

    this.id = 0;
	this.name = '';
	this.lat = '';
	this.lng = '';
	this.creationDate = new Date();
}


module.exports = Group;