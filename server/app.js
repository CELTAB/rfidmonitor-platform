global.__base = __dirname + '/'; //TODO: Change to '/server'
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
		duration: 30 * 60 * 1000, //keep session for 30 minutes
		activeDuration: 10 * 60 * 1000,
		secure: true
		// httpOnly: true,
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
			webPath = '/web',
			apiPath = '/api';

	var apiRoutes = new LoadRouter(apiPath);
	var login = new LoadLoginRouter();

	// Redirect any connection on http to https (secure)
	app.use('*', function(req, res, next){
		if(!req.secure){
			var host = req.headers.host.split(':')[0];
			//TODO On production, remove the :8143 port. Should be 443 (native)
			return res.redirect('https://' + host + ':' + httpsPort + req.originalUrl);
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

	app.use('/api/doc', express.static('../apidoc'));
	var authenticate = new tokenAuthentication(app);
	authenticate.useBearer(apiPath);

	//TODO: mudar de ../web/* para web quando app.js subir para o diretorio anterior
	app.use(webPath, redirectMidler);
	app.use(loginPath, redirectMidler);
	app.use(webPath, express.static('../web/private'));
	app.use(loginPath, express.static('../web/public/login'));
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
