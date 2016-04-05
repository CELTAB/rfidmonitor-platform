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

global.__base = __dirname + '/server/';
global.__DevEnv = false;
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
var session = require('client-sessions');
var passport = require('passport');

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

if(args.indexOf('--dev') > -1){
	global.__DevEnv = true;
	logger.warn('Starting on development mode');
}

var SynchronizeDb = require(__base + 'controller/database/synchronizedb');
SynchronizeDb.start(function(err){
	if(err){
		logger.error("Erro to initialize Database: " + err);
		return 1;
	}
	//Load Components olny after logger had started
	var Server = require(__base + 'controller/collector/server');
	var LoadRouter = require(__base + 'routes/loadroutes');
	var LoadLoginRouter = require(__base + 'routes/loadloginroute');
	var tokenAuthentication = require(__base + 'controller/tokenauthentication');
	var createDefaults = require(__base + 'controller/database/createdefaults');
	//Create default credentials if no user is found
	createDefaults(function(err){
		if(err)
			throw new Error('Error on create default credentials: ' + err);
	});

	//Clean restricted_media directory
	var cleanErrors = require(__base + 'utils/cleanrestrictedmedia')();
	if(cleanErrors){
		logger.error('Not able to clean restricted_media directory: ' + cleanErrors);
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
	app.use(passport.initialize());
	app.use(session({
		cookieName: 'appSession',
		secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
		duration: 60 * 60 * 1000, //keep session for 60 minutes
		activeDuration: 10 * 60 * 1000,
		secure: true
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
	var httpsPort = 8143;

	var loginPath = '/login',
			apiPath = '/api';

	var webPath = global.__DevEnv? '/web-dev' : '/web';

	var apiRoutes = new LoadRouter(apiPath);
	var login = new LoadLoginRouter();

	// Redirect any connection on http to https (secure)
	app.use('*', function(req, res, next){
		if(!req.secure){
			var host = req.headers.host.split(':')[0];
			return res.redirect('https://' + host + req.originalUrl);
		}
		next();
	});

	app.get('/', function(req, res){
		res.redirect(webPath);
	});
	var redirectMidler = function(req, res, next){
		if(req.originalUrl.indexOf(webPath) !== -1){
			return login.hasSession(req)? next() : res.redirect(loginPath);
		}else if(req.originalUrl.indexOf(loginPath) !== -1){
			return login.hasSession(req)? res.redirect(webPath): next();
		}else{
			logger.error("Unknown Location");
			return res.status(404).send({message: "Unknown Location"});
		}
	};

	app.use('/api/doc', express.static(__dirname + '/apidoc'));
	var authenticate = new tokenAuthentication(app);
	authenticate.useBearer(apiPath);

	app.use(webPath, redirectMidler);
	app.use(loginPath, redirectMidler);

	if(global.__DevEnv){
		app.use(webPath, express.static('web-dev/private'));
		app.use(loginPath, express.static('web-dev/public/login'));
	}else{
			app.use(webPath, express.static('web/private'));
			app.use(loginPath, express.static('web/public/login'));
	}

	app.use(apiPath, apiRoutes);
	app.use(login.routes);

	//Create and start server for collectors
	var server = new Server();
	server.startServer();

	https.createServer(options, app).listen(httpsPort, function(){
		logger.info("HTTPS server listening on port %s", httpsPort);
	});

	http.createServer(app).listen(httpPort, function(){
		logger.info("HTTP server listening on port %s", httpPort);
	});
});
