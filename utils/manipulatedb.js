var pg = require('pg');
var fs = require('fs');
var logger = require('winston');
var PlatformError = require('./platformerror');

var ManipulateDb = function (){}

var connectionString = 'postgres://rfidplatform:rfidplatform@localhost:5432/rfidplatform';
var queries;

var defaultScriptName = "rfidplatform.sql";

/*
	Connect into a database and execute a query.
*/
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

	/*
		Recursive function to execute a bunch of queries into the database synchronously. 
		Will execute the first query then call this function again passing the array with the remaining queries.
		This way, each query is executed in the right time, so we don't have errors caused by a relation between tables that does not exists yet.
	*/
ManipulateDb.prototype.executeStatements = function(queries, cb_done){

	//If the queries array is zero length, is the last call of the function. Just return.
	if(queries.length == 0){
		cb_done(null); //callback, when done
		return;
	}
	else{
		//get the first element (query) of the array, and remove it from this.
		var query = queries.shift();
		//If the query contains the "--" substring, means to be a comment so, don't need to be executed. Go to next iteration and than return.
		if(query.indexOf("--") == 0){
			return ManipulateDb.prototype.executeStatements(queries, cb_done);
		}

		//if the query is not a comment, execute it.
		ManipulateDb.prototype.query(query, [], function(err, result){
  			if(err){
  				//Error to execute a query. Drop application. See logs for more details
  				return cb_done(err);
  			}
  			//call the next iteration of the function, passing the remainig queries.
  			ManipulateDb.prototype.executeStatements(queries, cb_done);
  		});
	}
}

/*
	Create a new database and create the default schema of the rfidplatform project. 
	The schema is defined in the file rfidplatform.sql.
*/
ManipulateDb.prototype.createDefaultDataBase = function(dbName, callback){

	queries = fs.readFileSync(defaultScriptName).toString()
	.replace(/(\r\n|\n|\r)/gm," ") // remove newlines;
	.replace(/\s+/g, ' ') // excess white space
	.split(";") // split into all statements
	.map(Function.prototype.call, String.prototype.trim)
	.filter(function(el) {return el.length != 0}); // remove any empty ones

	var createQuery = "CREATE DATABASE " + dbName + ";";
	logger.debug("Creating database with name " + dbName);

	ManipulateDb.prototype.query(createQuery, [], function(error, result){

		if(error){
			//Error to create database. Probably already exists. See logs for more details
			return callback(error);
		}

		// console.log("Connected to postgreSQL");

		connectionString = 'postgres://rfidplatform:rfidplatform@localhost:5432/' + dbName;
		logger.debug("Connect to database: " + connectionString);
		ManipulateDb.prototype.executeStatements(queries, function(err){
			if(err){
				logger.error(err);
				return callback(err);
			}

			logger.debug("Database created");
			callback(null);
		});
	});
}

/*
	Drop a database. Receive the database name by parameter.
*/
ManipulateDb.prototype.dropDataBase = function(dbName, cb_done){

	try{
		//Close any connection, so it can drop the database.
		pg.end();
	}catch(e){
		logger.debug(e);
	}
	
	var dropQuery = "DROP DATABASE " + dbName + ";";
	logger.debug("Dropping database with name " + dropQuery);
	connectionString = 'postgres://rfidplatform:rfidplatform@localhost:5432/rfidplatform';

	ManipulateDb.prototype.query(dropQuery, [], function(err, result){

		if(err){
			//Don't need to do anything.
			return cb_done(err);

			// //Error to drop database. See logs for more details
			// throw new PlatformError(err);
		}

		logger.debug("Database " + dbName + " dropped");
		cb_done(null); //callback done
	});
}

module.exports = ManipulateDb;
