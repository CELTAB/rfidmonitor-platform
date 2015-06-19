var Server = require('./server');
var Logs = require('./logs').Logs;
var logger = require('./logs').Logger;


var args = process.argv;
var debugConsole = false;
var debugFile = false;

if(args.indexOf('--debugAll') > -1){
	debugConsole = true;
	debugFile = true;
}else{
	if(args.indexOf('--debugConsole') > -1){
		debugConsole = true;
	}

	if(args.indexOf('--debugFile') > -1){
		debugFile = true;
	}	
}


new Logs(debugConsole, debugFile);

var server = new Server();
server.startServer();


/*
	TODOs

	- Add a default group into sql script.

*/




/*
var Group = require('./models/group');
var GroupDao = require('./models/groupdao');

var groupDao = new GroupDao();
var group = new Group();
	group.name = "default";
	group.lat = 'abc';
	group.lng = 'def';
	group.creationDate = new Date();

	groupDao.insert(group, function(err,result){
		if (err)
			console.log("RFIDDataDao err : " + err);
		else
			console.log("RFIDDataDao group inserted : " + result);

		//callback(err,result);
	});
*/