global.__base = __dirname + '/';

var logger = require('winston');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var https = require('https');
var fs = require('fs');
var Cors = require('cors');
// var session = require('client-sessions');

// NOVO APP JS USADO APENAS PARA TESTES

var LoadRouter = require(__base + 'routes/loadroutes');
var LoadLoginRouter = require(__base + 'routes/loadloginroute');
var SynchronizeDb = require(__base + 'controller/database/synchronizedb');

SynchronizeDb.start(function(err){

	if(err){
		console.error("Erro to initialize Database: " + err);
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

	var httpPort = 8180;

	app.use('/api', new LoadRouter('/api'));
	app.use(new LoadLoginRouter());

	https.createServer(options, app).listen(8143, function(){
		logger.info("HTTPS server listening on port 8143");
	});

	// http.createServer(app).listen(httpPort, function(){
	// 	console.info("HTTP server listening on port %s", httpPort);
	// });
});
