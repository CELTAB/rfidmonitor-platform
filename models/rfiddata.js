var Rfiddata = function(){

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof Rfiddata)) {
        console.warn('Warning: Institution constructor called without "new" operator');
    }

    this.id = 0;
    this.timestamp = new Date();
    this.rfidcode = '';
    this.collector_id = 0;
	this.package_id = 0;
    this.extra_data = '';
}

module.exports = Rfiddata;