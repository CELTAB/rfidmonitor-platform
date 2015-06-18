var db = require('./database');
var Collector = require('./collector');

var CollectorDao = function(){

}

//Tries to insert, if fails by error of unique constraint, find and return.
CollectorDao.prototype.insertOrFindByMacUniqueError = function(collector, callback){

	if (false === (collector instanceof Collector)) {
        console.warn('Warning: CollectorDao : collector constructor called without "new" operator');
        return;
    } 

	//console.log("RFIDPLATFORM[DEBUG]: Inserting New Collector");
	var query = "INSERT INTO collector (description, group_id, lat, lng, mac, name, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ID";

	db.query(query, [collector.description, collector.groupId, collector.lat, collector.lng, collector.mac, collector.name, collector.status], function(err, result){
		if(err){
			if(String(err).indexOf("uq_collectormac") > -1){
				CollectorDao.prototype.findByMac(collector.mac,function(err,col){
					callback(err,col.id);
				});
				return;
			}else{
				console.log("CollectorDao insertOrFindByMacUniqueError error : " + err);
				return callback(err,null);
			}
		}
		var id = result.rows[0].id;		
		console.log("RFIDPLATFORM[DEBUG]: New Collector Inserted id: " + id);
		callback(null, id);
	});
}

CollectorDao.prototype.insert = function(collector, callback){

	if (false === (collector instanceof Collector)) {
        console.warn('Warning: CollectorDao : collector constructor called without "new" operator');
        return;
    } 

	//console.log("RFIDPLATFORM[DEBUG]: Inserting New Collector");
	var query = "INSERT INTO collector (description, group_id, lat, lng, mac, name, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ID";

	db.query(query, [collector.description, collector.groupId, collector.lat, collector.lng, collector.mac, collector.name, collector.status], function(err, result){
		if(err){
			console.log("CollectorDao insert error : " + err);
			return callback(err,null);
		}
		var id = result.rows[0].id;		
		console.log("RFIDPLATFORM[DEBUG]: New Collector Inserted id: " + id);
		callback(null, id);
	});
}

CollectorDao.prototype.findByMac = function(mac, callback){
	//TODO where mac = x and is active.
	var query = "SELECT * FROM collector WHERE mac = $1";

	// console.log("RFIDPLATFORM[DEBUG]: Searching for Collector with MAC " + mac);

	db.query(query, [mac], function(err, result){
		if(err){
			console.log("CollectorDao findByMac error : " + err);
			callback(err, null);
			return;
		}
		try{
			var collector = buildFromSelectResult(result);
			callback(null, collector);
		}catch(e){
			callback(e, null);
		}

	});
}

var buildFromSelectResult = function(result){

	var founds = result.rows;
	if(founds == 0)
		return null;
	else if(founds > 1){
		throw new Error("Unexpected Bahavior: More than one collector found");
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

/*
resultado insert
{
	"command": "INSERT",
	"rowCount": 1,
	"oid": 0,
	"rows": [
		{
			"id": 556
		}
	],
	"fields": [
		{
			"name": "id",
			"tableID": 16458,
			"columnID": 1,
			"dataTypeID": 23,
			"dataTypeSize": 4,
			"dataTypeModifier": -1,
			"format": "text"
		}
	],
	"_parsers": [
		null
	],
	"rowAsArray": false
}

*/


/*
findByMac

aqui{
	"command": "SELECT",
	"rowCount": 1,
	"oid": null,
	"rows": [
		{
			"id": 1114,
			"group_id": 1,
			"name": "Celtab-Serial",
			"mac": "B8:27:EB:BB:0C:70",
			"description": "",
			"lat": "",
			"lng": "",
			"status": 0
		}
	],
	"fields": [
		{
			"name": "id",
			"tableID": 16458,
			"columnID": 1,
			"dataTypeID": 23,
			"dataTypeSize": 4,
			"dataTypeModifier": -1,
			"format": "text"
		},
		{
			"name": "group_id",
			"tableID": 16458,
			"columnID": 2,
			"dataTypeID": 23,
			"dataTypeSize": 4,
			"dataTypeModifier": -1,
			"format": "text"
		},
		{
			"name": "name",
			"tableID": 16458,
			"columnID": 3,
			"dataTypeID": 25,
			"dataTypeSize": -1,
			"dataTypeModifier": -1,
			"format": "text"
		},
		{
			"name": "mac",
			"tableID": 16458,
			"columnID": 4,
			"dataTypeID": 25,
			"dataTypeSize": -1,
			"dataTypeModifier": -1,
			"format": "text"
		},
		{
			"name": "description",
			"tableID": 16458,
			"columnID": 5,
			"dataTypeID": 25,
			"dataTypeSize": -1,
			"dataTypeModifier": -1,
			"format": "text"
		},
		{
			"name": "lat",
			"tableID": 16458,
			"columnID": 6,
			"dataTypeID": 25,
			"dataTypeSize": -1,
			"dataTypeModifier": -1,
			"format": "text"
		},
		{
			"name": "lng",
			"tableID": 16458,
			"columnID": 7,
			"dataTypeID": 25,
			"dataTypeSize": -1,
			"dataTypeModifier": -1,
			"format": "text"
		},
		{
			"name": "status",
			"tableID": 16458,
			"columnID": 9,
			"dataTypeID": 23,
			"dataTypeSize": 4,
			"dataTypeModifier": -1,
			"format": "text"
		}
	],
	"_parsers": [
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null
	],
	"rowAsArray": false
}

*/