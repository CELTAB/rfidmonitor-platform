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
var session = require('express-session');
var ejs = require('ejs');
var passport = require('passport');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var PlatformRouter = require('./controllers/platformrouter');
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
require('./utils/baseutils').InitiateDb.start();

//--------------------


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
// app.use(bodyParser.urlencoded({extended : true}));
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


// Use express session support since OAuth2orize requires it
// TODO update secret below?
app.use(session({
  secret: 'Super Secret Session Key',
  resave : true, 
  saveUninitialized : true
}));

//Necessary headers to clients access.
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(passport.initialize());

app.all('*', function(req, res, next){
	logger.debug("Method " + req.method + " for URL " + req.url);
	next();
});1

app.use(function(err, req, res, next) {
	//This functions gets some erros like 'bodyParser errors'.
	//To check if it is bodyparser error, remove the response below and just call next().
	if(err){
		return res.status(400).json({"error" : "Error catch on app.js handler. Maybe bodyparser error: " + err});
	}	
	next();
})

var WebRouter = require('./controllers/webrouter');
app.use('/web', new WebRouter());

app.use('/', express.static('web/public'));
app.use('/api/doc', express.static('apidoc'));

// '/api' requires auth
app.use('/api', new PlatformRouter());

// var AdminRouter = require('./controllers/adminrouter');
// app.use('/admin', new AdminRouter());

https.createServer(options, app).listen(443);