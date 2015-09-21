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

var WebRouter = require('./controllers/webrouter');

var args = process.argv;
var debugConsole = false;
var debugFile = false;
var verboseConsole = false;
var verboseFile = false;
var sillyConsole = false;
var sillyFile = false;

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


new Logs(debugConsole, debugFile, verboseConsole, verboseFile, sillyConsole, sillyFile);
var server = new Server();
server.startServer();

//-- clean tmp restricted_media/tmp

	var cleanErrors = require('./utils/baseutils').cleanRestrictedMediaTmpSync();

	if(cleanErrors){
		return 1;
	}

//-- end of clean tmp restricted_media/tmp

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

	app.use(bodyParser.json({type: 'application/json'}));
	app.use(bodyParser.urlencoded({limit: '5mb', extended : true}));

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
	});

	var isSessionAuthorized = function(req,res,next){
		//check session
		// ...
		if(req.appSession && req.appSession.user){
			return next();
			// logger.info("HAS SESSION - " + JSON.stringify(req.appSession));
			// return res.redirect('/web');
		}

		// logger.info("Redirect to login");
		// return res.redirect('/login');
		return res.status(401).send({mssage: "No Session"});
		//If ok...
		// next();
	};

	// app.get('/', isSessionAuthorized);
	//Serve as static all files inside web/public folder
	app.use('/', express.static('web/public'));


	app.get('/web/private', isSessionAuthorized);
	app.use('/web/private', function(req, res, next){
		// logger.warn("aqui");
		if(!req.appSession || !req.appSession.user){
			return res.status(403).send({mssage: "No Session"});
		}
		next();
	});

	app.post('/login', function(req, res){

		var sequelize = require('./dao/platformsequelize');

		if(!req.body.username || !req.body.password)
			return res.status(400).send({message: "Missing username ou password"});

		logger.info("Username: " + req.body.username);
		logger.info("password: " + req.body.password);

		try{

			var User = sequelize.model("User");

			User.scope('loginScope').findOne({where: {username: req.body.username}})
				.then(function(user){

					if(user){

						if(user.isPasswordValid(req.body.password)){

							user = user.clean();
							var AppClient = sequelize.model('AppClient');

							AppClient.find(
									{
										where: {user_id: user.id}
									})
								.then(function(app){

									if(app){

										user.token = "defaulttokenaccess";
										// user.token = app.token;
										req.appSession.user = {id: user.id, username: user.username, email: user.email};
										return res.status(200).send(user);
									}else{
										logger.error("Token not found for user " + user.username);
										return res.status(401).send({message: "User not allowed"});
									}

								}).catch(function(err){
									logger.error("Find AppClient: " + err);
									return res.send(500).send({message: "INTERNAL ERROR : " + err});				
								});

						}else{
							return res.status(400).send({message:"Password don't match to this user"});
						}

					}else{
						return res.status(400).send({message: "Username not match to any user"});
					}

				})
				.catch(function(e){
					logger.error("Find User: " + e);
					return res.send(500).send({message: "INTERNAL ERROR : " + e});
				});

		}catch(error){
			logger.error(error);
			return res.send(500).send({message: "INTERNAL ERROR : " + error});
		}

	});

	app.post('/logout', function(req, res){
		delete req.appSession.user;
		res.status(200).send({message: "Lougout, no access to this page anymore"});
	});


	// var WebRouter = require('./controllers/webrouter');
	// app.use('/web', new WebRouter());
	app.use('/web/private', express.static('web/private'));

	app.use('/api/doc', express.static('apidoc'));

	app.use('/api', new PlatformRouter());
	app.use('/api', new DERouter());

	https.createServer(options, app).listen(8143);

	// prepare redirection from http to https
	var httpPort = 8180;
	http.createServer(function(req, res){
		res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    	res.end();
	}).listen(httpPort, function(){
		logger.info("HTTP server listening on port " + httpPort);
	});
});