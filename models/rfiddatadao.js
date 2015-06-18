var db = require('./database');
var CollectorDao = require('./collectordao');
var Collector = require('./collector');
var Rfiddata = require('./rfiddata')

var GroupDao = require('./groupdao');
var Group = require('./group');

var RFIDDataDao = function(){
	//global?
	collectorDao = new CollectorDao();
	groupDao = new GroupDao();
}

var insertSummary = function(rfiddata, collector, summaryCallback){

    // console.log("RFIDPLATFORM[DEBUG]: Inserting New RFIDData");
    existsByHash(rfiddata.md5diggest, function(err, exists){
        if(!exists){

            totalDataCount = rfiddata.data.length;

            if(totalDataCount == 0){
                return summaryCallback("ERROR totalDataCount: " + JSON.stringify(rfiddata,null,"\t"), null);
            }
            dataCount = 0;

            for (i=0; i<totalDataCount; i++){

                var rfidObject = new Rfiddata();
                rfidObject.groupId = collector.groupId;
                rfidObject.timestamp = rfiddata.data[i].datetime;
                rfidObject.md5hash = rfiddata.md5diggest;
                rfidObject.rfidcode = rfiddata.data[i].identificationcode;
                rfidObject.collector_id = collector.id;
                // rfidObject.extra_data = ;
                rfidObject.collector_mac = collector.mac;

                insertRFIDData(rfidObject, summaryCallback);
            }            
            
        }
        else{
            //TODO send ACK-DATA in this situation?
            console.log("RFIDData already has the hash pesisted. ACK-DATA needed.");
        }

    });     

}

var insertRFIDData = function(rfiddata, summaryCallback){

    var query = "INSERT INTO rfiddata (collector_mac, group_id, timestamp, md5hash, rfidcode, collector_id, extra_data) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ID";

    db.query(query, [rfiddata.collector_mac, rfiddata.groupId, rfiddata.timestamp, rfiddata.md5hash, rfiddata.rfidcode, rfiddata.collector_id, rfiddata.extra_data], function(err, result){
        
        if(err){
            return summaryCallback(err, null);
        }

        console.log("RFIDPLATFORM[DEBUG]: RFIDData Inserted. HASH: " + rfiddata.md5hash);
        dataCount++;
        if(dataCount == totalDataCount)
            summaryCallback(null,rfiddata.md5hash);
    });


}

var existsByHash = function(hash,callback){
    var query = "SELECT id FROM rfiddata WHERE md5hash = $1";

    db.query(query, [hash], function(err, result){
        
        if(err){
            return callback(err, null);            
        }

        callback(null, result.rowCount > 0);
    });
}

RFIDDataDao.prototype.insert = function(obj, callback){

	//TODO check obj structure?

	/*
		1) Get collector;
		 - if not exists save new.
		2) Insert rfiddata.
		3) call callback with success or failure.
	*/

	collectorDao.findByMac(obj.macaddress, function(err,collector){

		if(err){
			console.log("RFIDDataDao error " + err);
			return callback(err,null);
		}

		if(collector === null){
			var newCollector = new Collector();

           
			newCollector.groupId = 1;  //set default group.
			newCollector.name = obj.name;
			newCollector.mac = obj.macaddress;
			newCollector.status = newCollector.statusEnum.Online;

			collectorDao.insertOrFindByMacUniqueError(newCollector, function(err, collectorId){
				if(err){
					console.log("RFIDDataDao error " + err);
					return;
				}
                newCollector.id =  collectorId;
                insertSummary(obj.datasummary, newCollector, callback);

            }); 
        }else{
            insertSummary(obj.datasummary, collector, callback);
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