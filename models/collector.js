var Collector = function(){

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof Collector)) {
        console.warn('Warning: Collector constructor called without "new" operator');
    }
}


module.exports = Collector;