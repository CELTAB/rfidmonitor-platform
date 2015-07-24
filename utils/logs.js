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

	this.checkLogsDir();

	// Default transporters
	winston.remove(winston.transports.Console);
	
	winston.add(
		winston.transports.DailyRotateFile, 
		{
			name: 'dailyinfo',
			filename: logsDir + 'info.log',
			level: 'info',
			datePattern: '.dd',
			maxsize: 1024 * 1024 * 5,
			maxFiles: 10, 
			handleExceptions: true,
			json: false,
			colorize: true
		}
	);

	winston.add(
		winston.transports.Console, 
		{
			name: 'consolewarn',
			level: 'warn',
			json: false,
			colorize: true,
			silent: false,
		}
	);


	if(debugConsole){
		console.log("Printing debug messages on Console");
		winston.remove('consolewarn');
		winston.add(
			winston.transports.Console, 
			{
				name: 'consoledebug',
				level: 'debug',
				json: false,
				colorize: true,
				handleExceptions: true,
			}
		);
	}

	if(debugFile){
		console.log("Printing debug messages on File");
		winston.add(
			winston.transports.DailyRotateFile, 
			{
				name: 'dailydebug',
				filename: logsDir + 'debug.log',
				level: 'debug',
				datePattern: '.dd',
				maxsize: 1024 * 1024 * 5,
				maxFiles: 10, 
				json: false,
				handleExceptions: true,
				colorize: true,
			}
		);
	}

	if(verboseConsole){
		console.log("Printing verbose messages on Console");

		winston.remove('consoledebug');
		
		winston.add(
			winston.transports.Console, 
			{
				name: 'consoleverbose',
				level: 'verbose',
				json: false,
				colorize: true
			}
		);
	}

	if(verboseFile){
		console.log("Printing verbose messages on File");
		winston.add(
			winston.transports.DailyRotateFile, 
			{
				name: 'dailyverbose',
				filename: logsDir + 'verbose.log',
				level: 'verbose',
				datePattern: '.dd',
				maxsize: 1024 * 1024 * 5,
				maxFiles: 10, 
				json: false
			}
		);
	}

	winston.info("Logger started.");
}

Logs.prototype.checkLogsDir = function(){
	try{
		fs.mkdirSync(logsDir);
	}catch(e){
		if(e.code != 'EEXIST'){
	  		console.error("Cannot create logs directory to server directory. Aborting app. Error: " + JSON.stringify(e));
	  		return;
		}
		//else OK. The error EEXIST means the directory already exists. fs.exists is deprecated.
	}	

	try{
		var path = logsDir + 'test'
		fs.writeFileSync(path, 'testtext');
		fs.unlinkSync(path);

	}catch(e){
		console.error("Error while using logs directory. Aborting app. Error: " + JSON.stringify(e));
		throw e;
	}
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