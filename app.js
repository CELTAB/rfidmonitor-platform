// Keep as firsts requires >>> 
var Logs = require('./utils/logs').Logs;
var logger = require('winston');
// <<< end of 'keep as first requires'

var Server = require('./utils/server');

var args = process.argv;
var debugConsole = false;
var debugFile = false;
var verboseConsole = false;
var verboseFile = false;

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


new Logs(debugConsole, debugFile, verboseConsole, verboseFile);
var server = new Server();
server.startServer();


/*
	TODOs

	- Implement the silly debug and verbose;
	- Implement the admin user interface;
	- Normalize database;
	- create userDao; 
	- Implement Transactions;
	- protocol-connection : check packet size is a integer to avoid this 'debug: processDataBuffer : New pkt found with size : NaN'
	- RESTFUL
		- Authentication using oauth2. (every single thing following should be authenticated.)
		- Access Permissions. (every single service must have access permissions)
		- Services:
			- Show to the requester how to make a request (service documentation pattern).
				Like: collector/get -> collector/get/how
			- Validate every single service request:
				Like: max_resuts, date_range, etc
			- Only after authentication and validation, process request and return json object with the response.
			- Any error in any place must respond with a default error object with explantory message.
	- Delete protocol-collection on 'end' signal.

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