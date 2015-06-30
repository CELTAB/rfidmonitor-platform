var db = require('./database');
var pg = require('pg');
var fs = require('fs');
var logger = require('winston');
var PlatformError = require('./platformerror');

var ManipulateDb = function (){}

var connectionString;
var queries;

var tableList = ["INSTITUTION",];
var defaultScriptName = "rfidplatform.sql";

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

ManipulateDb.prototype.query = function(text, values, cb) {
    pg.connect(connectionString, function(err, client, done) {
      	if (err)
      		cb(err, null);
        else
          client.query(text, values, function(err, result) {
            done();
            cb(err, result);
          })
    });
}

ManipulateDb.prototype.executeStatements = function(queries){


	var toExecute = queries.length;

	console.log("Number of Queries: " + queries.length);

	if(queries.length == 0){
		logger.debug("Database created");
		return;
	}
	else{
		var query = queries.shift();
		if(query.indexOf("--") == 0){
			return ManipulateDb.prototype.executeStatements(queries);
		}

		ManipulateDb.prototype.query(query, [], function(err, result){
  			if(err){
  				//Error to execute a query. See logs for more details
  				throw new PlatformError(err);
  			}

  			ManipulateDb.prototype.executeStatements(queries);

  		});
	}
}

ManipulateDb.prototype.createDefaultDataBase = function(DbName){

	queries = fs.readFileSync(defaultScriptName).toString()
	.replace(/(\r\n|\n|\r)/gm," ") // remove newlines;
	.replace(/\s+/g, ' ') // excess white space
	.split(";") // split into all statements
	.map(Function.prototype.call, String.prototype.trim)
	.filter(function(el) {return el.length != 0}); // remove any empty ones

	var createQuery = "CREATE DATABASE " + DbName + ";";
	console.log("Creating database with name " + createQuery);

	db.query(createQuery, [], function(err, result){

		if(err){
			//Error to create database. Probably already exists. See logs for more details
			throw new PlatformError(err);
		}

		connectionString = 'postgres://rfidplatform:rfidplatform@localhost:5432/' + DbName;
		logger.debug("Connect to database: " + connectionString);
		ManipulateDb.prototype.executeStatements(queries);
	});
}

module.exports = ManipulateDb;
