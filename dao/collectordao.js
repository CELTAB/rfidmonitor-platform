var db = require('../utils/database');
var Collector = require('../models/collector');
var GroupDao = require('./groupdao');
var logger = require('winston');

var PlatformError = require('../utils/platformerror');
var resultToArray = require('../utils/baseutils').resultToArray;

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

		var query = "INSERT INTO collector (description, group_id, lat, lng, mac, name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ID";

		db.query(query, [collector.description, collector.groupId, collector.lat, collector.lng, collector.mac, collector.name], function(err, result){
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
			collector.id = id;
			collector.status = collector.statusEnum.UNKNOWN;
			require('../controllers/collectorpool').push(collector);
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

		var query = "INSERT INTO collector (description, group_id, lat, lng, mac, name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ID";
		db.query(query, [collector.description, collector.groupId, collector.lat, collector.lng, collector.mac, collector.name], function(err, result){
			if(err){
				logger.error("CollectorDao insert error : " + err);
				return callback(err,null);
			}
			var id = result.rows[0].id;		
			logger.debug("New Collector Inserted id: " + id);
			collector.id = id;
			collector.status = collector.statusEnum.UNKNOWN;
			require('../controllers/collectorpool').push(collector);
			callback(null, id);
		});
    });
}

//Prepare the collector to be inserted
CollectorDao.prototype.prepareCollector = function(collector, callbackInsert){
	if(collector.groupId == 0){
    		try{
    			new GroupDao().getDefault(function(err, defaultGroup){
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

// CollectorDao.prototype.updateStatus = function(collectorId, newStatus, callback){

// 	var query = "UPDATE collector SET status = $2 WHERE id = $1";

// 	db.query(query, [collectorId, newStatus], function(err, result){
// 		if(err){
// 			logger.error("CollectorDao updateStatus error : " + err);
// 			callback(err, null);
// 			return;
// 		}

// 		callback(null, result.rowCount);
// 	});
// }

CollectorDao.prototype.updateCollector = function(c, callback){
// id | group_id | name | mac | description | lat | lng
	var query = "UPDATE collector SET group_id = $1, name = $2, mac = $3, description = $4, lat = $5, lng = $6, WHERE id = $7";

	db.query(query, [c.groupId, c.name, c.mac, c.description, c.lat, c.lng, c.id], function(err, result){
		if(err){
			logger.error("CollectorDao updateCollector error : " + err);
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

		if(result.rowCount > 1){
	        var msg = "Unexpected Bahavior: More than one collector found";
			throw new PlatformError(msg);
	        return;
	    }

		try{
			var collector = fromDbObj(result);
			callback(null, collector);
		}catch(e){
			logger.error("CollectorDao findByMac: " + e);
			callback(e, null);
		}
	});
}

CollectorDao.prototype.findById = function(id, callback){
	//TODO where mac = x and is active.
	var query = "SELECT * FROM collector WHERE id = $1";

	// logger.debug("Searching for Collector with MAC " + mac);

	db.query(query, [id], function(err, result){
		if(err){
			logger.error("CollectorDao findById error : " + err);
			callback(err, null);
			return;
		}

		if(result.rowCount > 1){
	        var msg = "Unexpected Bahavior: More than one collector found";
			throw new PlatformError(msg);
	        return;
	    }

		try{
			callback(null, fromDbObj(result));
		}catch(e){
			logger.error("CollectorDao findById: " + e);
			callback(e, null);
		}
	});
}

var fromDbObj = function(dbObj){

	if(!dbObj)
		return null;

	var collector = new Collector();
	collector.id = dbObj.id;
	collector.groupId = dbObj.group_id;
	collector.name = dbObj.name;
	collector.mac = dbObj.mac;
	collector.description = dbObj.description;
	collector.lat = dbObj.lat;
	collector.lng = dbObj.lng;
	collector.status = collector.statusEnum.UNKNOWN;

    return collector;
}

CollectorDao.prototype.findAll = function(limit, offset, callback){
	//TODO where mac = x and is active.
	var query = "SELECT * FROM collector";
	var parameters = [];

	if(limit){
        query += ' LIMIT $1';
        parameters.push(limit);
    }

    if(offset){
        query += ' OFFSET $2';
        parameters.push(offset);
    }

	db.query(query, parameters, function(err, result){
		if(err){
			logger.error("CollectorDao findAll error : " + err);
			callback(err, null);
			return;
		}
		try{
			callback(null, resultToArray.toArray(fromDbObj, result.rows));
		}catch(e){
			logger.error("CollectorDao findAll: " + e);
			callback(e, null);
		}
	});
}

CollectorDao.prototype.deleteById = function(id, callback){
	//TODO where mac = x and is active.
	var query = "DELETE FROM collector where id = $1";

	db.query(query, [id], function(err, result){
		if(err){
			logger.error("CollectorDao deleteById error : " + err);
			callback(err, null);
			return;
		}
		callback(null, result.rowCount);
	});
}


module.exports = CollectorDao;