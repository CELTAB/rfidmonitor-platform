var logger = require('winston');

var Collector = function(obj){

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof Collector)) {
        logger.error('Error: Collector constructor called without "new" operator');
        throw new Error('Collector constructor called without "new" operator');
    }

    if(obj){
        this.id = obj.id;
        this.groupId = obj.groupId;
        this.lat = obj.lat;
        this.lng = obj.lng;
        this.mac = obj.mac;
        this.name = obj.name;
        this.status = Collector.prototype.setStatusEnum(obj.status);
        this.description = obj.description;
    }else{
        this.id = 0;
        this.groupId = 0;
        this.lat = '';
        this.lng = '';
        this.mac = '';
        this.name = '';
        this.status = Collector.prototype.statusEnum.UNKNOWN;
        this.description = '';
    }

}

Collector.prototype.setStatusEnum = function(status){
    switch(status){
        case Collector.prototype.statusEnum.ONLINE:
            return status;
        case Collector.prototype.statusEnum.OFFLINE:
            return status;
        default:
            return Collector.prototype.statusEnum.UNKNOWN;        
    }
}

Collector.prototype.statusEnum = {ONLINE : "ONLINE", OFFLINE : "OFFLINE", UNKNOWN : "UNKNOWN"}

module.exports = Collector;