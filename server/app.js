global.__base = __dirname + '/';
// Keep as firsts requires >>>
var Logs = require(__base + 'utils/logs');
var logger = require('winston');
// <<< end of 'keep as first requires'
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var https = require('https');
var fs = require('fs');
var Cors = require('cors');
//TODO: Implement permissions
//TODO: Implement session
// var session = require('client-sessions');

var args = process.argv;
var debugConsole = false,
debugFile = false,
sillyConsole = false,
sillyFile = false;
// Verify parameters for logs configuration
if(args.indexOf('--debugAll') > -1){
	debugConsole = true;
	debugFile = true;
}else{
	if(args.indexOf('--debugConsole') > -1){
		debugConsole = true;
	}else if (args.indexOf('--sillyConsole') > -1){
		sillyConsole = true;
	}

	if(args.indexOf('--debugFile') > -1){
		debugFile = true;
	}else if (args.indexOf('--sillyFile') > -1){
		sillyFile = true;
	}
}
new Logs(debugConsole, debugFile, sillyConsole, sillyFile);

//Load Components olny after logger had started
var Server = require(__base + 'controller/collector/server');
var LoadRouter = require(__base + 'routes/loadroutes');
var LoadLoginRouter = require(__base + 'routes/loadloginroute');
var SynchronizeDb = require(__base + 'controller/database/synchronizedb');

SynchronizeDb.start(function(err){
	if(err){
		logger.error("Erro to initialize Database: " + err);
		return 1;
	}
	/*
	How to generate ssl files. On terminal type:
		openssl genrsa -out platform-key.pem 1024
		openssl req -new -key platform-key.pem -out platform-cert-req.csr
		openssl x509 -req -in platform-cert-req.csr -signkey platform-key.pem -out platform-cert.pem
	*/
	var options = {
		key: fs.readFileSync(__base + 'config/ssl/platform-key.pem'),
		cert: fs.readFileSync(__base + 'config/ssl/platform-cert.pem')
	};

	var app = express();
	app.use(Cors());
	app.use(bodyParser.json({type: 'application/json'}));
	app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
	//TODO: create session

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

	//Definir se será usado
	app.all('*', function(req, res, next){
		res.response = function(error, responseStatus, message){
			var sendMessage = {message: message, status: responseStatus};
			if(error){
				sendMessage.error = error;
			}
			return res.status(responseStatus).send(sendMessage);
		};
		next();
	});

	app.use(function(err, req, res, next) {
		//This functions gets some erros like 'bodyParser errors'.
		//To check if it is bodyparser error, remove the response below and just call next().
		if(err){
			return res.status(400).send({message: "Something wrong with your object", error: err.toString(), status: 400});
		}
		next();
	});

	//TODO: Create structure for public and private.
	app.use('/', express.static('../web/private'));

	var httpPort = 8180;
	var httpsPort = 8143;

	app.use('/api', new LoadRouter('/api'));
	app.use(new LoadLoginRouter());

	//Create and start server for collectors
	var server = new Server();
	server.startServer();

	https.createServer(options, app).listen(httpsPort, function(){
		logger.info("HTTPS server listening on port 8143");
	});

	// http.createServer(app).listen(httpPort, function(){
	// 	console.info("HTTP server listening on port %s", httpPort);
	// });
});
