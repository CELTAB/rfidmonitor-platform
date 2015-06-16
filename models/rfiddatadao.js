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

RFIDDataDao.prototype.insert = function(obj, callback){


   // console.log(">>>>>>  OBJECT   <<<<<<<< " + JSON.stringify(obj));

	//TODO check obj structure?

	/*
		1) Get collector;
		 - if not exists save new.
		2) Insert rfiddata.
		3) call callback with success or failure.
	*/

    var rfiddataInsert = function(rfiddata){

        console.log("RFIDPLATFORM[DEBUG]: Inserting New RFIDData");
        console.log("COLLECTOR ID: " + rfiddata.collector_id);
        var query = "INSERT INTO rfiddata (collector_mac, group_id, timestamp, md5hash, rfidcode, collector_id, extra_data) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ID";

        db.query(query, [rfiddata.collector_mac, rfiddata.group_id, rfiddata.timestamp, rfiddata.md5hash, rfiddata.rfidcode, rfiddata.collector_id, rfiddata.extra_data], function(err, result){
            
            if(err)
                callback(err, null);

            //console.log("RFIDPLATFORM[DEBUG]: RFIDData Inserted. HASH: " + rfiddata.md5hash);
            callback(null, rfiddata.md5hash);
        });
    }

	collectorDao.findByMac(obj.macaddress, function(err,collector){

        // console.log("RFIDPLATFORM[DEBUG]: Find Collector By Mac >>> " + collector);

		if(err){
			console.log("RFIDDataDao error " + err);
			return callback(err,null);
		}

        var rfidObject = new Rfiddata();
        // rfidObject.group_id = ;
        // rfidObject.timestamp = ;
        // rfidObject.md5hash = ;
        // rfidObject.rfidcode = ;
        // rfidObject.collector_id = ;
        // rfidObject.extra_data = ;
        // rfidObject.collector_mac = ;
        // rfidObject.collector_id = ;

		if(collector === null){
			console.log("No Collector Found");
            console.log("NAME: " + obj.name);
			var newCollector = new Collector();

			newCollector.groupId = 1;
			newCollector.name = obj.name;
			newCollector.mac = obj.macaddress;
			//newCollector.status = newCollector.statusEnum.Online; //TODO enum?

			collectorDao.insert(newCollector, function(err,result){
				if(err){
					console.log("RFIDDataDao error " + err);
					return;
				}

                // console.log(">>>>>> HEREEEEE <<<<<<<\n\n" + JSON.stringify(result));
                // console.log("Collector Inserted with ID: " + result.rows[0].id);
                obj.datasummary.collector_id = result.rows[0].id;
                obj.datasummary.collector_mac = newCollector.mac;
                rfiddataInsert(obj.datasummary);
			});	
		}else{
                //console.log("RESULTTTTT >> " + JSON.stringify(collector[0],null, "\t"));

// rfiddata.collector_mac, rfiddata.group_id, rfiddata.timestamp, rfiddata.md5hash, rfiddata.rfidcode, rfiddata.collector_id, rfiddata.extra_data
                
                rfidObject.collector_mac = collector.mac;
                rfidObject.group_id = collector.group_id;

                rfidObject.rfidcode = pack.identificationcode;

                // identificationcode
                var pack = obj.datasummary.data[0];

                console.log(">>>>>>>>>>>> OBJECT >> " + JSON.stringify(pack.identificationcode));

                // console.log("RFIDOBJECT >> " + JSON.stringify(rfidObject));

               // obj.datasummary.collector_id = collector[0].id;
                
                // rfiddataInsert(rfidObject);
		}
	});


}

module.exports = RFIDDataDao;

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