global.__base = __dirname + '/';

var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

// NOVO APP JS USADO APENAS PARA TESTES

var LoadRouter = require(__base + 'routes/loadroutes');
var SynchronizeDb = require(__base + 'controller/database/synchronizedb');

SynchronizeDb.start(function(err){

	if(err){
		console.error("Erro to initialize Database: " + err);
		return;
	}

	var app = express();

	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());

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

	http.createServer(app).listen(httpPort, function(){
		console.info("HTTP server listening on port %s", httpPort);
	});
});
