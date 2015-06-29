var express = require('express');
var session = require('express-session');
var passport = require('passport');
var bodyParser = require('body-parser');
var cors = require('cors');
var ManipulateDb = require('../utils/manipulatedb');
var Institution = require('./models/institution');
var InstitutionDao = require('./models/institutiondao');
var institutionController = require('./controllers/institution');

var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

var router = express.Router();

router.get('/', function(req, res) {
  res.json({ message: 'You are running dangerously low on beer!' }); 
});

router.route('/institution').post(institutionController.postInstitution);

app.use('/api', router);

var listenIP = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'; 
var listenPort = process.env.OPENSHIFT_NODEJS_PORT || '3000';

app.listen(listenPort, listenIP, function(){
	console.log('%s: Node server started on %s:%d ...', Date(Date.now() ), listenIP, listenPort);
});

var manipulateDb = new ManipulateDb();
// manipulateDb.dropAll(function(err, result){
// 	if (err)
// 		return console.log(err);

// 	console.log(result);

	manipulateDb.createAll(function(err, result){
	 	if (err)
	 		return console.log(err);
		
		var count = 65;
		var insert = function(){
			var itaipu = new Institution();

			count++;
			itaipu.name = "CELTAB" + count;
			var institutionDao = new InstitutionDao();
			institutionDao.insert(itaipu, function(err, result){
				if(err){
					console.log(err);
				}
				else{
					console.log("Insert institution " + "CELTAB" + count);
					if(count > 70)
						return;

					var timer = setTimeout(insert, 1000 * 60);
				}
			});
		};

		//var timer = setTimeout(insert, 1000);

	});
// });


	


	

