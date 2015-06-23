var db = require('../utils/database');
var CollectorDao = require('./collectordao');
var Collector = require('../models/collector');
var Rfiddata = require('../models/rfiddata');
var logger = require('winston');

var PackageDao = require('./packagedao');
var Package = require('../models/package');
var GroupDao = require('./groupdao');
var Group = require('../models/group');

var RFIDDataDao = function(){
	//global? sim
	collectorDao = new CollectorDao();
	groupDao = new GroupDao();
    packagedao = new PackageDao();
}

var insertSummary = function(rfiddata, collector, summaryCallback){

    if(rfiddata.data.length == 0){
        logger.warn("Empty package received. send ACK-DATA");
        return summaryCallback(null, rfiddata.md5diggest);
    }

    existsByHash(rfiddata.md5diggest, function(err, exists){
        if(!exists){

            var pkObj = new Package();
            pkObj.package_hash = rfiddata.md5diggest;
            pkObj.package_size = rfiddata.data.length;

            packagedao.insert(pkObj, function(err, pk_id){
                if(err){
                    logger.error("RFIDATADAO insertSummary. ERROR: " + err);
                    //Something bad happend.
                    return;
                }

                totalDataCount = rfiddata.data.length;
                var dataCount = 0;

                for (i=0; i<totalDataCount; i++){

                    var rfidObject = new Rfiddata();
                    rfidObject.timestamp = rfiddata.data[i].datetime;
                    rfidObject.rfidcode = rfiddata.data[i].identificationcode;
                    rfidObject.collector_id = collector.id;
                    rfidObject.package_id = pk_id;

                    //Insert the hash to is available in the next function. So it can send and ACK-DATA with the package hash.
                    rfidObject.tmpHash = rfiddata.md5diggest;
                    rfidObject.dbIndex = i + 1;
                    rfidObject.totalCount = totalDataCount;

                    insertRFIDData(rfidObject, function(err){
                        if(err){
                            logger.error("Error: " + err);
                            return;
                        }

                        dataCount++;
                        if(dataCount == totalDataCount)
                            summaryCallback(null, rfiddata.md5diggest);
                    });
                }
            });
        }else{
            //The server already has the package with this hash, so send the ACK-DATA to the collector to confirm persistence.
            logger.info("Package already has the hash pesisted. ACK-DATA needed.");
            summaryCallback(null, rfiddata.md5diggest);
        }
    });     
}

var insertRFIDData = function(rfiddata, summaryCallback){

    var query = "INSERT INTO rfiddata (timestamp, rfidcode, collector_id, extra_data, package_id) VALUES ($1, $2, $3, $4, $5) RETURNING ID";

    db.query(query, [rfiddata.timestamp, rfiddata.rfidcode, rfiddata.collector_id, rfiddata.extra_data, rfiddata.package_id], function(err, result){
        
        if(err){
            logger.error("insertRFIDData error: " + err);
            return summaryCallback(err);
        }

        summaryCallback(null);
    });
}

var existsByHash = function(hash,callback){

    packagedao.findByHash(hash, function(err, pk){
        if(err){
            logger.error("Error RfiddataDao.existByHahs: " + err);
            return;
        }

        if(pk != null)
            callback(null, true);
        else
            callback(null, false);
    });
}

RFIDDataDao.prototype.insert = function(obj, callback){

	collectorDao.findByMac(obj.macaddress, function(err, collector){
		if(err){
			logger.error("RFIDDataDao error " + err);
			return callback(err,null);
		}

        if(collector != null){
            insertSummary(obj.datasummary, collector, callback);
        }else{

            var collectorObj = new Collector();
            collectorObj.mac = obj.macaddress;
            collectorObj.name = obj.name;

            try{
                /*
                    If the collector does not exists, we try to insert it again. 
                    But if wee receive a uniqueError the collector is search one more time.

                    It's done this way because when the collector send a LOT of DATA packages with an unknown collector mac, the server will try to insert this collector before save the Rfidadata.
                    But, the problem happens if a new package arraives with the same collector mac before the insertion of the previous one. 
                    So, the next instance of this code will try to search but don't find again bacause the insertion is not done yet.
                */
                collectorDao.insertOrFindByMacUniqueError(collectorObj, function(err, collectorId){

                    if(collectorId == null){
                        logger.error(err);
                        return;
                    }
                        
                    objReady.id = collectorId;
                    insertSummary(obj.datasummary, collectorObj, callback);
                });
            }catch(e){
                logger.error(e);
            }
        }
	});
}

module.exports = RFIDDataDao;

/*
>>>>>>  OBJECT   <<<<<<<< {
    "datasummary": {
        "data": [
            {
                "applicationcode": 0,
                "datetime": "2014-10-15T15:58:33",
                "id": 1282,
                "idantena": 1,
                "idcollectorpoint": 100,
                "identificationcode": 44332211
            }
        ],
        "idbegin": -1273252204,
        "idend": -1273254596,
        "md5diggest": "f9b0941547b464689121e9e80266fde2"
    },
    "id": 100,
    "macaddress": "B8:27:EB:BB:0C:70",
    "name": "Celtab-Serial"
}

*/

/*
        "datasummary": {
            "data": [
                {
                    "applicationcode": 0,
                    "datetime": "2014-10-14T19:52:27",
                    "id": 13,
                    "idantena": 1,
                    "idcollectorpoint": 100,
                    "identificationcode": 44332233
                },
                {
                    "applicationcode": 0,
                    "datetime": "2014-10-14T19:52:28",
                    "id": 14,
                    "idantena": 1,
                    "idcollectorpoint": 100,
                    "identificationcode": 44332233
                },
                {
                    "applicationcode": 0,
                    "datetime": "2014-10-14T19:52:29",
                    "id": 15,
                    "idantena": 1,
                    "idcollectorpoint": 100,
                    "identificationcode": 44332233
                },
                {
                    "applicationcode": 0,
                    "datetime": "2014-10-14T19:52:30",
                    "id": 16,
                    "idantena": 1,
                    "idcollectorpoint": 100,
                    "identificationcode": 44332233
                },
                {
                    "applicationcode": 0,
                    "datetime": "2014-10-14T19:52:31",
                    "id": 17,
                    "idantena": 1,
                    "idcollectorpoint": 100,
                    "identificationcode": 44332233
                },
                {
                    "applicationcode": 0,
                    "datetime": "2014-10-14T19:52:32",
                    "id": 18,
                    "idantena": 1,
                    "idcollectorpoint": 100,
                    "identificationcode": 44332233
                }
            ],
            "idbegin": 18219088,
            "idend": 0,
            "md5diggest": "0e414979a87245b06cc817b9e837239b"
        },
        "id": 100,
        "macaddress": "78:2B:CB:C0:7B:85",
        "name": "celtba-tester"
    }
*/