var logger = require('winston');

var Collector = function(){

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof Collector)) {
        logger.error('Error: Collector constructor called without "new" operator');
        throw new Error('Collector constructor called without "new" operator');
    }

    this.statusEnum = {
        Online: 0,
        Offline: 1
    };

    this.id = 0;
    this.group_id = 0;
    this.lat = '';
    this.lng = '';
    this.mac = '';
    this.name = '';
    this.status = this.statusEnum.Offline;
    this.description = '';
}

module.exports = Collector;