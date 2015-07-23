var db = require('../utils/database');
var CollectorDao = require('./collectordao');
var Collector = require('../models/collector');
var Rfiddata = require('../models/rfiddata');
var logger = require('winston');

var PackageDao = require('./packagedao');
var Package = require('../models/package');
var GroupDao = require('./groupdao');
var Group = require('../models/group');

var resultToArray = require('../utils/baseutils').resultToArray;

var RFIDDataDao = function(){
	collectorDao = new CollectorDao();
	groupDao = new GroupDao();
    packagedao = new PackageDao();
}

var fromDbObj = function(dbObj){
    if(!dbObj)
        return null;

    var r = new Rfiddata();

    r.id = dbObj.id;
    r.rfidReadDate = dbObj.rfid_read_date;
    r.serverReceivedDate = dbObj.server_received_date ;
    r.rfidcode = dbObj.rfidcode;
    r.collectorId = dbObj.collector_id;
    r.packageId = dbObj.package_id;
    r.extraData = dbObj.extra_data;

    return r;
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
                    return;
                }

                totalDataCount = rfiddata.data.length;
                var dataCount = 0;

                for (i=0; i<totalDataCount; i++){

                    var rfidObject = new Rfiddata();
                    rfidObject.rfidReadDate = rfiddata.data[i].datetime;
                    rfidObject.rfidcode = rfiddata.data[i].identificationcode;
                    rfidObject.collectorId = collector.id;
                    rfidObject.packageId = pk_id;

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

    var query = "INSERT INTO rfiddata (rfid_read_date, rfidcode, collector_id, extra_data, package_id, server_received_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ID";

    db.query(query, [rfiddata.rfidReadDate, rfiddata.rfidcode, rfiddata.collectorId, rfiddata.extraData, rfiddata.packageId, rfiddata.serverReceivedDate], function(err, result){
        
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
                        
                    collectorObj.id = collectorId;
                    insertSummary(obj.datasummary, collectorObj, callback);
                });
            }catch(e){
                logger.error(e);
            }
        }
	});
}

RFIDDataDao.prototype.findAll = function(limit, offset, callback){

    var query = 'SELECT * FROM rfiddata';

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
            logger.error("RFIDDataDao findByAll error : " + err);
            return callback(err,null);
        }

        try{
            callback(null, resultToArray.toArray(fromDbObj, result.rows));
        }catch(e){
            callback(e, null);
        }
    });
}

module.exports = RFIDDataDao;