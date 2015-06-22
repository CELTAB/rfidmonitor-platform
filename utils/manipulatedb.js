var db = require('./database');

var ManipulateDb = function (){}

var tableList = ["INSTITUTION",];

ManipulateDb.prototype.dropAll = function(callback){
	var dropTableQuery = "DROP TABLE IF EXISTS :table";

	for (var tableIndex in tableList){
		var table = tableList[tableIndex];

		// db.query(dropTableQuery.replace(":table",table), [], function(err, result){
		// 	if(err)
		// 		console.log("Error: "+ err);
		// });
		db.query(dropTableQuery.replace(":table",table), [], callback);
	}
}

ManipulateDb.prototype.createAll = function(finalCallback){
	this.createTbInstitution(function(err, result){
		finalCallback(err, result);
	});
}

ManipulateDb.prototype.createTbInstitution = function(cb){
	var createTableQuery = 	"CREATE TABLE IF NOT EXISTS INSTITUTION ("+
							"ID SERIAL PRIMARY KEY NOT NULL,"+
							"NAME CHAR(60) NOT NULL, "+
							"LAT CHAR(60), "+
							"LNG CHAR(60), "+
							"DATE TIMESTAMPTZ NOT NULL)";

	db.query(createTableQuery, [], cb);
}

module.exports = ManipulateDb;
