var Server = require('./server');

var server = new Server();

server.startServer();

/*
	TODOs

	- Add a default group into sql script.


*/

/*

var group = new Group();
	group.name = "test";
	group.lat = 'abc';
	group.lng = 'def';
	group.creationDate = new Date();

	groupDao.insert(group, function(err,result){
		if (err)
			console.log("RFIDDataDao err : " + err);
		else
			console.log("RFIDDataDao group inserted : " + result);

		callback(err,result);
	});

*/