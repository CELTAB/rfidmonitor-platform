var express = require('express');
var session = require('express-session');
var passport = require('passport');
var bodyParser = require('body-parser');
var cors = require('cors');
var ManipulateDb = require('./manipulatedb');
var Institution = require('./models/institution');
var InstitutionDao = require('./models/institutiondao');
var institutionController = require('./controllers/institution');


// var manipulateDb = new ManipulateDb();
// manipulateDb.dropAll(function(err, result){
// 	if (err)
// 		return console.log(err);

// 	manipulateDb.createAll(function(err, result){
// 		if (err)
// 			return console.log(err);
		
// 		var itaipu = new Institution();
// 		var institutionDao = new InstitutionDao();
// 		institutionDao.insert(itaipu, function(err, result){
// 			if(err)
// 				console.log(err);
// 			else
// 				console.log(result);
// 		});

// 	});
// });



// app.use(bodyParser.urlencoded({
//   extended: true
// }));

// var router = express.Router();

// router.route('/institution').post(institutionController.postBeers);

// app.use('/api', router);

// var listenIP = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'; 
// var listenPort = process.env.OPENSHIFT_NODEJS_PORT || '3000';

// app.listen(listenPort, listenIP, function(){
// 	console.log('%s: Node server started on %s:%d ...', Date(Date.now() ), self.ipaddress, self.port);
// });
	


	

