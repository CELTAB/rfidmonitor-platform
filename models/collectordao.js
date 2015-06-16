var db = require('./database');
var Collector = require('./collector');

var CollectorDao = function(){

}

CollectorDao.prototype.insert = function(obj, callback){

	if (false === (obj instanceof Collector)) {
        console.warn('Warning: CollectorDao : obj constructor called without "new" operator');
        return;
    } 

	//console.log("RFIDPLATFORM[DEBUG]: Inserting New Collector");
	var query = "INSERT INTO collector (description, group_id, lat, lng, mac, name, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ID";

	db.query(query, [obj.description, obj.groupId, obj.lat, obj.lng, obj.mac, obj.name, obj.status], function(err, result){
		console.log("RFIDPLATFORM[DEBUG]: New Collector Inserted");
		callback(err, result);
	});

    //console.log("INSERT Collector: " + JSON.stringify(obj));
   // callback(null, "NOIS");

	// REMEMBER TO VALIDATE THE SQL STRING
	// VALIDATE OBJ
}

CollectorDao.prototype.findByMac = function(mac, callback){
	var query = "SELECT * FROM collector WHERE mac = $1";

	console.log("RFIDPLATFORM[DEBUG]: Searching for Collector with MAC " + mac);

	db.query(query, [mac], function(err, result){
		if(err){
			console.log("CollectorDao findByMac error : " + err);
			callback(err, null);
			return;
		}		

		var collector = buildFromSelectResult(result);
		callback(null, collector);
	});
}

var buildFromSelectResult = function(result){

	var founds = result.rows;
	if(founds == 0)
		return null;
	else if(founds > 1)
		throw new Error("Unexpected Bahavior: More than one collector found");

	//console.log("FOUNDSSSS >> " + founds.length + "\t\t" + JSON.stringify(result,null, "\t"));
    return founds;
}

module.exports = CollectorDao;

/*
select sem resultado
{
	"command": "SELECT",
	"rowCount": 0,
	"oid": null,
	"rows": [],
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
			"name": "rfiddata_type_id",
			"tableID": 16458,
			"columnID": 8,
			"dataTypeID": 23,
			"dataTypeSize": 4,
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
		null,
		null
	],
	"rowAsArray": false
}


*/