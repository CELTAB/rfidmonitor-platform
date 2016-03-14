/****************************************************************************
**
** Copyright (C) 2015
**                     Gustavo Valiati <gustavovaliati@gmail.com>
**                     Thiago R. M. Bitencourt <thiago.mbitencourt@gmail.com>
**
** This file is part of the FishMonitoring project
**
** This program is free software; you can redistribute it and/or
** modify it under the terms of the GNU General Public License
** as published by the Free Software Foundation; version 2
** of the License.
**
** This program is distributed in the hope that it will be useful,
** but WITHOUT ANY WARRANTY; without even the implied warranty of
** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
** GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License
** along with this program; if not, write to the Free Software
** Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
**
****************************************************************************/

'use strict';
var fs = require('fs');
var winston = require('winston');
var logsDir = __base + 'logs/';
var Logs = function(debugConsole, debugFile, sillyConsole, sillyFile){
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

	//CONSOLE
  if(debugConsole){
		console.log("Printing debug messages on Console");
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
	}else if(sillyConsole){
		console.log("Printing silly messages on Console");
		winston.add(
			winston.transports.Console,
			{
				name: 'sillydebug',
				level: 'silly',
				json: false,
				colorize: true,
				handleExceptions: true,
			}
		);
	}else{
		winston.add(
			winston.transports.Console,
			{
				name: 'consolewarn',
				level: 'info',
				json: false,
				colorize: true,
				silent: false,
			}
		);
	}

	//FILE
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
	if(sillyFile){
		console.log("Printing silly messages on File");
		winston.add(
			winston.transports.DailyRotateFile,
			{
				name: 'dailysilly',
				filename: logsDir + 'silly.log',
				level: 'silly',
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

module.exports = Logs;
