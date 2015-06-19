var db = require('./database');
var CollectorDao = require('./collectordao');
var Collector = require('./collector');
var Rfiddata = require('./rfiddata')

var PackageDao = require('../dao/packagedao');
var Package = require('./package');
var GroupDao = require('./groupdao');
var Group = require('./group');

var RFIDDataDao = function(){
	//global?
	collectorDao = new CollectorDao();
	groupDao = new GroupDao();
    packagedao = new PackageDao();
}

var insertSummary = function(rfiddata, collector, summaryCallback){

    console.log("RECEIVING RFIDPACKAGE: " + JSON.stringify(rfiddata));


    if(rfiddata.data.length == 0){
        console.log("Empty package received. send ACK-DATA");
        return summaryCallback(null, rfiddata.md5diggest);
    }

    // console.log("RFIDPLATFORM[DEBUG]: Inserting New RFIDData");
    existsByHash(rfiddata.md5diggest, function(err, exists){
        if(!exists){

            var pkObj = new Package();
            pkObj.package_hash = rfiddata.md5diggest;
            pkObj.package_size = rfiddata.data.length;

            packagedao.insert(pkObj, function(err, pk_id){
                if(err){
                    console.log("RFIDATADAO insertSummary. ERROR: " + err);
                    //Something bad happend.
                    return;
                }

                totalDataCount = rfiddata.data.length;
                dataCount = 0;

                for (i=0; i<totalDataCount; i++){

                    var rfidObject = new Rfiddata();
                    rfidObject.timestamp = rfiddata.data[i].datetime;
                    rfidObject.rfidcode = rfiddata.data[i].identificationcode;
                    rfidObject.collector_id = collector.id;
                    rfidObject.package_id = pk_id;

                    insertRFIDData(rfidObject, summaryCallback);
                }
            });
        }else{
            //TODO send ACK-DATA in this situation?
            console.log("RFIDData already has the hash pesisted. ACK-DATA needed.");
            summaryCallback(null, rfiddata.md5diggest);
        }
    });     
}

var insertRFIDData = function(rfiddata, summaryCallback){

    var query = "INSERT INTO rfiddata (timestamp, rfidcode, collector_id, extra_data, package_id) VALUES ($1, $2, $3, $4, $5) RETURNING ID";

    db.query(query, [rfiddata.timestamp, rfiddata.rfidcode, rfiddata.collector_id, rfiddata.extra_data, rfiddata.package_id], function(err, result){
        
        if(err){
            return summaryCallback(err, null);
        }

       // console.log("RFIDPLATFORM[DEBUG]: RFIDData Inserted. HASH: " + rfiddata.md5hash);
        dataCount++;
        if(dataCount == totalDataCount)
            summaryCallback(null, rfiddata.md5hash);
    });
}

var existsByHash = function(hash,callback){

    packagedao.findByHash(hash, function(err, pk){
        if(err){
            console.log("Error RfiddataDao.existByHahs: " + err);
            return;
        }

        if(pk != null)
            callback(null, true);
        else
            callback(null, false);
    });
}

RFIDDataDao.prototype.insert = function(obj, callback){

    console.log("RFIDDATADAO INSERT..." + JSON.stringify(obj));

	collectorDao.findByMac(obj.macaddress, function(err,collector){
		if(err){
			console.log("RFIDDataDao error " + err);
			return callback(err,null);
		}

        if(collector != null){
            console.log("RFIDDATADAO -- Collector Found...");
            insertSummary(obj.datasummary, collector, callback);
        }else{

            
            console.log("RFIDDATADAO -- Collector NOT Found...");
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