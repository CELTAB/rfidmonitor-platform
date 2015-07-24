var logger = require('winston');
var PlatformError = require('../utils/platformerror');
var db = require('../utils/database');
var Collector = require('../models/collector');
var CollectorDao = require('../dao/collectordao');

var CollectorPool = function CollectorPool(){

	var pool = [];
	var collectorDao = new CollectorDao();

	collectorDao.findAll(null, null, function(err, collectors){
		if(err)
			return new PlatformError("CollectorPool : Cannot get all collectors from database. Error: " + err); 

		pool = collectors;

		logger.debug("CollectorPool : pool populated from database : " + JSON.stringify(pool));1
	});

	this.getAll = function(){
		return pool;
	}

	this.updateStatusByMac = function(collector, status){
		for (var i in pool) {
			if(pool[i].mac == mac){
				pool[i].status = status;
				logger.debug("CollectorPool " + mac + " updated to " + status);
				return true;
			}
		}
		logger.debug("CollectorPool: " + mac + " not found on pool.");
		
		if(collector.id){
			//This is a known collector receiving the ONLINE status for the first time. This collector was added to database on fly by this it was not on the pool already.
			pool.push(collector);
			return true;
		}
		//the collector was not in the pool and is not on the database. Not reason to update a unknown collector.
		return false;
	}
    
    this.push = function(collector){
    	logger.debug("CollectorPool: pushed : " + JSON.stringify(collector));
    	pool.push(collector);
	}

	this.removeByMac = function(mac){
		for (var i in pool) {
			if(pool[i].mac == mac){
				pool.splice(i, 1);
				logger.debug("Collector " + mac + " removed.");
				return true;
			}
		}
		logger.debug("CollectorPool: " + mac + " removed.");
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