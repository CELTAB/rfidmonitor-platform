var db = require('./database');
var CollectorDao = require('./collectordao');
var Collector = require('./collector');

var GroupDao = require('./groupdao');
var Group = require('./group');

var RFIDDataDao = function(){
	//global?
	collectorDao = new CollectorDao();
	groupDao = new GroupDao();
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
			console.log("collector null");
			var newCollector = new Collector();

			newCollector.groupId = 1;
			newCollector.name = obj.name;
			newCollector.mac = obj.macaddress;
			newCollector.status = "Online"; //TODO enum?
			newCollector.rfiddata_type; //TODO que que é isso mesmo?

			collectorDao.insert(newCollector, function(err,result){
				if(err){
					console.log("RFIDDataDao error " + err);
					return;
				}

				console.log("result" + result);
			});	
		}else{
			callback(null,collector);
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