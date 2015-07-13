var db = require('../utils/database');
var Collector = require('../models/collector');
var GroupDao = require('./groupdao');
var logger = require('winston');

var PlatformError = require('../utils/platformerror');
var groupdao = new GroupDao();

var CollectorDao = function(){
	
}

//Tries to insert, if fails by error of unique constraint, find and return.
CollectorDao.prototype.insertOrFindByMacUniqueError = function(collector, callback){

    if (false === (collector instanceof Collector)) {
        var msg = 'CollectorDao : collector constructor called without "new" operator';
		throw new PlatformError(msg);
        return;
    }

	//prepare the collector to be inserted into the data base
	CollectorDao.prototype.prepareCollector(collector, function(collectorOk){

		var query = "INSERT INTO collector (description, group_id, lat, lng, mac, name, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ID";

		db.query(query, [collector.description, collector.group_id, collector.lat, collector.lng, collector.mac, collector.name, collector.status], function(err, result){
			if(err){
				if(String(err).indexOf("uq_collectormac") > -1){
					CollectorDao.prototype.findByMac(collector.mac,function(err,col){
						if(err){
							logger.error("CollectorDao insertOrFindByMacUniqueError error :" + err);
							return callback(err, null);
						}
						callback(err,col.id);
					});
					return;
				}else{
					logger.error("CollectorDao insertOrFindByMacUniqueError error : " + err);
					return callback(err,null);
				}
			}
			var id = result.rows[0].id;		
			logger.debug("New Collector Inserted id: " + id);
			callback(null, id);
		});
	});
}

//before insert verify if the collector have the group information. If doesn't have, get the defaul group.
CollectorDao.prototype.insert = function(collector, callback){

    if (false === (collector instanceof Collector)) {
        var msg = 'CollectorDao : collector constructor called without "new" operator';
		throw new PlatformError(msg);
        return;
    }

    CollectorDao.prototype.prepareCollector(collector, function(collectorOk){

		var query = "INSERT INTO collector (description, group_id, lat, lng, mac, name, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ID";

		db.query(query, [collectorOk.description, collectorOk.group_id, collectorOk.lat, collectorOk.lng, collectorOk.mac, collectorOk.name, collectorOk.status], function(err, result){
			if(err){
				logger.error("CollectorDao insert error : " + err);
				return callback(err,null);
			}
			var id = result.rows[0].id;		
			logger.debug("New Collector Inserted id: " + id);
			callback(null, id);
		});
    });
}

//Prepare the collector to be inserted
CollectorDao.prototype.prepareCollector = function(collector, callbackInsert){
	if(collector.group_id == 0){
    		try{
    			groupdao.getDefault(function(err, defaultGroup){
    				if(defaultGroup != null){
    					collector.group_id = defaultGroup.id;
    					callbackInsert(collector);
    				}else{
    					/*This probably will never happend, because the getDefault function will return an existing default group 
    					or insert one and then return it.
    					*/
						throw new PlatformError('ERROR: There is no Default Group in the data base.');
        				return;
    				}
    			});
    		}catch(e){
    			logger.error(e);
    		}
    }else{
		callbackInsert(collector);
    }
}

CollectorDao.prototype.updateStatus = function(collectorId, newStatus, callback){

	var query = "UPDATE collector SET status = $2 WHERE id = $1";

	db.query(query, [collectorId, newStatus], function(err, result){
		if(err){
			logger.error("CollectorDao updateStatus error : " + err);
			callback(err, null);
			return;
		}

		callback(null, result.rowCount);
	});
}

CollectorDao.prototype.findByMac = function(mac, callback){
	//TODO where mac = x and is active.
	var query = "SELECT * FROM collector WHERE mac = $1";

	// logger.debug("Searching for Collector with MAC " + mac);

	db.query(query, [mac], function(err, result){
		if(err){
			logger.error("CollectorDao findByMac error : " + err);
			callback(err, null);
			return;
		}
		try{
			var collector = buildFromSelectResult(result);
			callback(null, collector);
		}catch(e){
			logger.error("CollectorDao findByMac: " + e);
			callback(e, null);
		}
	});
}

var buildFromSelectResult = function(result){

	var founds = result.rows;
	if(founds == 0)
		return null;
	else if(founds > 1){
        var msg = "Unexpected Bahavior: More than one collector found";
		throw new PlatformError(msg);
        return;
    }

	var collector = new Collector();
	collector.id = result.rows[0].id;
	collector.groupId = result.rows[0].group_id;
	collector.name = result.rows[0].name;
	collector.mac = result.rows[0].mac;
	collector.description = result.rows[0].description;
	collector.lat = result.rows[0].lat;
	collector.lng = result.rows[0].lng;
	collector.status = result.rows[0].status;

    return collector;
}

module.exports = CollectorDao;