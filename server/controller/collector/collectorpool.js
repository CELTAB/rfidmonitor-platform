var logger = require('winston');
var PlatformError = require(__base + 'utils/platformerror');
var Collector = require(__base + 'models/collector');
// var db = require('../utils/database');
// var CollectorDao = require('../dao/collectordao');

var CollectorPool = function CollectorPool(){
	var pool = {};
	Collector.findAll().then(function(collectors){
		collectors.forEach(function(collector){
			var c = collector.get({plain: true});
			logger.silly("Load Collecor: " + c.name);
			pool[c.mac] = c;
		});
		logger.debug("CollectorPool : pool populated from database : " + JSON.stringify(pool));
	}).catch(function(e){
		return new PlatformError("CollectorPool : Cannot get all collectors from database. Error: " + e);
	});

	this.getAll = function(){
		return pool;
	}

	this.getStatusByMac = function(mac){
    if(pool[mac]){
      return pool[mac].status || Collector.statusEnum.OFFLINE;
    }
    logger.debug("Collector pool getStatusByMac" + mac + " not found.");
		return Collector.statusEnum.OFFLINE;
  }

	this.updateStatusByMac = function(collector, status){
		if(this.isCollectorValid(collector)){
			logger.debug("Setting status of " + collector.name + " to: " + status);
			if(pool[collector.mac]){
				pool[collector.mac].status = status;
				return true;
			}else{
				logger.error('CollectorPool : updateStatusByMac : Collector not fond when it should be');
			}
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
