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
var PlatformRouter = require('./controllers/platformrouter');
var Server = require('./utils/server');

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
// TODO: Create database on starting app. If exists, just continue

var ManipulateDb = require('./utils/manipulatedb');
var manipulate = new ManipulateDb();

//if the connection with the database fails, throw error and stop the app.
manipulate.testConnection();


/*-------------------------------------------------------------*/

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
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

// Use express session support since OAuth2orize requires it
// TODO update secret below?
app.use(session({
  secret: 'Super Secret Session Key',
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use('/api', new PlatformRouter());

// http.createServer(app).listen(80);
https.createServer(options, app).listen(443);