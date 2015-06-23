var db = require('../utils/database');
var Group = require('../models/group');
var logger = require('winston');

var GroupDao = function(){
	//this.insertDefault();
}

GroupDao.prototype.insert = function(group, callback){

	if (false === (group instanceof Group)) {
        var msg = 'GroupDao: group constructor called without "new" operator';
		new platformError(msg);
        return;
    }

    var query = 'INSERT INTO "group" (name, creation_date, description, isdefault) VALUES ($1, $2, $3, $4) RETURNING ID';

	db.query(query, [group.name, group.creation_date, group.description, group.isdefault], function(err, result){
		if(err){
			logger.error("GroupDao insert error : " + err);
			return callback(err,null);
		}

			var id = result.rows[0].id;		
			logger.info("RFIDPLATFORM[DEBUG]: New group Inserted with ID: " + id);
			callback(null, id);
	});
}

GroupDao.prototype.findById = function(groupId, callback){

	var query = 'SELECT * FROM "group" WHERE id = $1';

	db.query(query, [groupId], function(err, result){
		if(err){
			logger.error("GroupDao findById error : " + err);
			return callback(err,null);
		}

		try{
			var groupById = buildFromSelectResult(result);
			callback(null, groupById);
		}catch(e){
			callback(e, null);
		}
	});
}

//return the objetc correspondig to a default group
GroupDao.prototype.getDefault = function(callback){

	var query = 'SELECT * FROM "group" WHERE isdefault=$1';
	db.query(query, [true], function(err, result){
		if(err){
        	var msg = 'GroupDao getDefault error : ' + err;
			new platformError(msg);
        	return;
    	}

		var defaultFound = buildFromSelectResult(result);

		if(defaultFound == null){

			logger.debug("Inserting default group");
			var defaultGroup = new Group();
			defaultGroup.name = "Default";
			defaultGroup.description = "Default group";
			defaultGroup.isdefault = true;

			try{
				GroupDao.prototype.insert(defaultGroup, function(err, id){
					if(err){
						logger.error("GroupDao1: InsertDefault error.");
						return;
					}
					defaultGroup.id = id;
					logger.debug("Default group inserted with ID " + id);
					callback(null, defaultGroup);
				});
			}catch(e){
				logger.error('ERROR: Default Group insertion exception. ' + e);
			}
		}else{
			callback(null, defaultFound);
		}
	});
}

var buildFromSelectResult = function(result){
	var founds = result.rows;
	if(founds.length == 0){
		return null;
	}
	else if(founds.length > 1){
		var msg = "Unexpected Bahavior: More than one group found";
		new platformError(msg);
        return;
	}

	var group = new Group();
	group.id = result.rows[0].id;
	group.name = result.rows[0].name;
	group.creation_date = result.rows[0].creation_date;
    group.description = result.rows[0].description;

    return group;
}

module.exports = GroupDao;