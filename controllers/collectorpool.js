var logger = require('winston');
var PlatformError = require('../utils/platformerror');
var db = require('../utils/database');
var Collector = require('../models/collector');
var CollectorDao = require('../dao/collectordao');

var CollectorPool = function CollectorPool(){

	var pool = {};
	var collectorDao = new CollectorDao();

	collectorDao.findAll(null, null, function(err, collectors){
		if(err)
			return new PlatformError("CollectorPool : Cannot get all collectors from database. Error: " + err); 

		for(var i in collectors){
			pool[collectors[i].mac] = collectors[i];
		}

		logger.debug("CollectorPool : pool populated from database : " + JSON.stringify(pool));
	});

	this.getAll = function(){
		return pool;
	}

	this.getStatusByMac = function(mac){
        if(pool[mac]){
            return pool[mac].status;
        }
        logger.debug("Collector pool getStatusByMac" + mac + " not found.");
        return Collector.prototype.statusEnum.OFFLINE;
    }

	this.updateStatusByMac = function(collector, status){
		
		if(this.isCollectorValid(collector)){
			pool[collector.mac].status = status;
			return true;
		}

		logger.error("CollectorPool : updateStatusByMac : invalid collector");
		return false;
	}
    
    this.push = function(collector){

    	if(this.isCollectorValid(collector)){
			pool[collector.mac] = collector;
			logger.debug("CollectorPool : pushed");
			return true;
		}

		logger.error("CollectorPool : push : invalid collector");
		return false;
	}

	this.removeByMac = function(mac){

		if(pool[mac]){
			delete pool[mac];
			logger.debug("Collector " + mac + " removed.");
			return true;
		}
		logger.debug("Collector " + mac + " not found.");
		return false;

	}

	this.isCollectorValid = function(collector){
		var regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
		if(collector.mac && regex.test(collector.mac)){
			return true;
		}
		return false;
	}
 
    if(CollectorPool.caller != CollectorPool.getInstance){
        throw new PlatformError("This object cannot be instanciated");
    }
}
 
CollectorPool.instance = null;
 

CollectorPool.getInstance = function(){
    if(this.instance === null){
        this.instance = new CollectorPool();
    }
    return this.instance;
}
 
module.exports = CollectorPool.getInstance();