var fs = require('fs');
var winston = require('winston');

var logsDir = 'logs/';

var Logs = function(debugConsole, debugFile, verboseConsole, verboseFile){

	/*
	silly: 0, -> print all above
	debug: 1,
	verbose: 2,
	info: 3,
	warn: 4,
	error: 5
	*/

	var transpCustom = [];

	if(debugConsole){
		console.log("Printing debug messages on Console");
		transpCustom.push(
			new (winston.transports.Console)({
				name: 'consoledebug',
				level: 'debug',
				json: false,
				colorize: true
				})
			);
	}

	if(debugFile){
		console.log("Printing debug messages on File");
		transpCustom.push(
			new (winston.transports.DailyRotateFile)({
				name: 'dailydebug',
				filename: logsDir + 'debug.log',
				level: 'debug',
				datePattern: '.dd',
				maxsize: 1024 * 1024 * 5,
				maxFiles: 10, 
				json: false,
				silent: false
			})
		);
	}

	if(verboseConsole){
		console.log("Printing verbose messages on Console");
		transpCustom.push(
			new (winston.transports.Console)({
				name: 'consoleverbose',
				level: 'verbose',
				json: false,
				colorize: true
				})
			);
	}

	if(verboseFile){
		console.log("Printing verbose messages on File");
		transpCustom.push(
			new (winston.transports.DailyRotateFile)({
				name: 'dailyverbose',
				filename: logsDir + 'verbose.log',
				level: 'verbose',
				datePattern: '.dd',
				maxsize: 1024 * 1024 * 5,
				maxFiles: 10, 
				json: false,
				silent: false
			})
		);
	}

	var transp = [];

	transp.push(
		new (winston.transports.DailyRotateFile)({
    		name: 'dailyinfo',
			filename: logsDir + 'info.log',
			level: 'info',
			datePattern: '.dd',
			maxsize: 1024 * 1024 * 5,
			maxFiles: 10, 
			handleExceptions: true,
			json: false,
			colorize: true
		})
	);
	transp.push(
		new (winston.transports.Console)({
			name: 'consolewarn',
			level: 'warn',
			json: false,
			colorize: true
		})
	);

	var transp = transp.concat(transpCustom);

	winston.loggers.add('rfidplatform', {
		transports: transp
	});



	try{
		fs.mkdirSync(logsDir);
	}catch(e){
		if(e.errno != 47){
	  		winston.loggers.get('rfidplatform').error("Cannot create logs directory to server directory. Aborting app. Error: " + JSON.stringify(e));
	  		return;
		}
		//else OK. The error 47 means the directory already exists. fs.exists is deprecated.
	}	

	try{
		var path = logsDir + 'test'
		fs.writeFileSync(path, 'testtext');
		fs.unlinkSync(path);

		//Remove old logs
		// this.removeOldLogs(logsDir, 30, function(err, removedNr){
		// 	if (err){
		// 		winston.error("Error while removing old logs.");
		// 		throw new Error(err);
		// 	}

		// });
	}catch(e){
		winston.loggers.get('rfidplatform').error("Error while using logs directory. Aborting app. Error: " + JSON.stringify(e));
		throw e;
	}
	winston.loggers.get('rfidplatform').info("Logger started.");
}

Logs.prototype.removeOldLogs = function(path, daysKeep, callback){
	fs.readdir(path, function(err, files) {
		if (err) return callback(err,null);

		files.forEach(function(file, index) {

			var fullpath = path+file;

			fs.stat(fullpath, function(err, stat){
				if (err) return callback(err,null);

				var now = new Date().getTime();
				var fileModificationDate = new Date(stat.mtime).getTime();

				var diffInMs = now - fileModificationDate;

				if ( (diffInMs / 1000 / 60 / 60 / 24) > daysKeep ){
					fs.unlink(fullpath, function(err){
						if (err) return callback(err,null);

						winston.loggers.get('rfidplatform').info("Old log file removed: " + fullpath);

					});
				}

			});
		});
	});
}

module.exports.Logs = Logs;
module.exports.Logger = winston.loggers.get('rfidplatform');