/*
	TODOs

	- Implement the silly debug and verbose;
	- Implement the admin user interface;
	- create userDao; 
	- Implement Transactions;
	- RESTFUL
		- Authentication using oauth2. (every single thing following should be authenticated.)
		- Access Permissions. (every single service must have access permissions)
		- Services:
			- Show to the requester how to make a request (service documentation pattern).
				Like: collector/get -> collector/get/how
			- Validate every single service request:
				Like: max_resuts, date_range, etc
			- Only after authentication and validation, process request and return json object with the response.
			- Any error in any place must respond with a default error object with explantory message.

	- Create user on postgres that not depends of a database
	- remove ejs.

*/


// Keep as firsts requires >>> 
var Logs = require('./utils/logs').Logs;
var logger = require('winston');
// <<< end of 'keep as first requires'

var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
// var session = require('express-session');
var session = require('client-sessions');
var ejs = require('ejs');
var passport = require('passport');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var Cors = require('cors');

var PlatformRouter = require('./controllers/platformrouter');
var DERouter = require('./controllers/derouter');
var Server = require('./utils/server');
var Collector = require('./models/collector');

var args = process.argv;
var debugConsole = false;
var debugFile = false;
var verboseConsole = false;
var verboseFile = false;

if(args.indexOf('--debugAll') > -1){
	debugConsole = true;
	debugFile = true;
}else{
	if(args.indexOf('--debugConsole') > -1){
		debugConsole = true;
	}else if (args.indexOf('--verboseConsole') > -1){
		verboseConsole = true;
	}

	if(args.indexOf('--debugFile') > -1){
		debugFile = true;
	}else if (args.indexOf('--verboseFile') > -1){
		verboseFile = true;
	}	
}


new Logs(debugConsole, debugFile, verboseConsole, verboseFile);
var server = new Server();
server.startServer();

//--------------------
// Verify database and default user creation
require('./utils/baseutils').InitiateDb.start(function(err){

	if(err){
		logger.error("Error loading models: " + err);
		return 1;
	}

	/*
	How to generate ssl files. On terminal type:
		openssl genrsa -out platform-key.pem 1024
	 	openssl req -new -key platform-key.pem -out platform-cert-req.csr
	 	openssl x509 -req -in platform-cert-req.csr -signkey platform-key.pem -out platform-cert.pem
	*/
	var options = {
	  key: fs.readFileSync('ssl/platform-key.pem'),
	  cert: fs.readFileSync('ssl/platform-cert.pem')
	};

	var app = express();

	app.use(Cors());

	app.use(bodyParser.urlencoded({extended : true}));
	app.use(bodyParser.json());
	app.use(expressValidator({
	  	customValidators: {
		    isArray: function(value) {
		        return Array.isArray(value);
		    },
		    gte: function(param, num) {
		        return param >= num;
		    },
		    isCollectorStatus: function(status){
		    	return new Collector().setStatusEnum(status) != 'UNKNOWN';
		    },
		    isMac: function(mac){
		    	var regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
		    	return regex.test(mac);
		    },
		    isUndefined: function(field){
		    	return (typeof field === "undefined");
		    }
	    }
	}));// this line must be immediately after express.bodyParser()!

	app.use(passport.initialize());

	// Use this configuration.
	app.use(session({
	  cookieName: 'appSession',
	  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
	  duration: 30 * 60 * 1000,
	  activeDuration: 5 * 60 * 1000
	  // httpOnly: true,
	  // secure: true,
	  // ephemeral: true
	}));

	//Necessary headers to clients access.
	app.all('*', function(req, res, next) {
	  res.header('Access-Control-Allow-Origin', '*');
	  res.header('Access-Control-Allow-Credentials', 'true');
	  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	  next();
	});

	app.all('*', function(req, res, next){
		logger.debug("Method " + req.method + " for URL " + req.url);
		next();
	});

	app.use(function(err, req, res, next) {
		//This functions gets some erros like 'bodyParser errors'.
		//To check if it is bodyparser error, remove the response below and just call next().
		if(err){
			return res.status(400).json({"error" : err});
		}
		next();
	})

	app.get('/', function(req, res){
		//Redirect to /web when the GET request to / arrives
		res.redirect('/web');
	});

	var WebRouter = require('./controllers/webrouter');
	app.use('/web', new WebRouter());

	//Serve as static all files inside web/public folder
	app.use('/web/public', express.static('web/public'));

	app.use('/api/doc', express.static('apidoc'));

	app.use('/api', new PlatformRouter());
	app.use('/api', new DERouter());

	https.createServer(options, app).listen(443);



});

//--------------------
