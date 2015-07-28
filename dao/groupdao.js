var db = require('../utils/database');
var Group = require('../models/group');
var logger = require('winston');
var PlatformError = require('../utils/platformerror');
var resultToArray = require('../utils/baseutils').resultToArray;

var GroupDao = function(){
	//this.insertDefault();
}

GroupDao.prototype.insert = function(group, callback){

	if (false === (group instanceof Group)) {
        var msg = 'GroupDao: group constructor called without "new" operator';
		throw new PlatformError(msg);
        return;
    }

    if(group.isDefault === false)
    	group.isDefault = null;

    logger.debug(group.isDefault);

    var query = 'INSERT INTO "group" (name, creation_date, description, isdefault) VALUES ($1, $2, $3, $4) RETURNING ID';

	db.query(query, [group.name, group.creationDate, group.description, group.isDefault], function(err, result){
		if(err){
			var msg = "GroupDao insert " + err;
			logger.error(msg);
			return callback(msg,null);
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

			if(result.rows.length > 1){
				var msg = "Unexpected Bahavior: More than one group found";
				throw new PlatformError(msg);
		        return;
			}

		try{
			var groupById = fromDbObj(result.rows[0]);
			callback(null, groupById);
		}catch(e){
			callback(e, null);
		}
	});
}

GroupDao.prototype.findAll = function(limit, offset, callback){

	var query = 'SELECT * FROM "group"';

	var parameters = [];

	if(limit){
        query += ' LIMIT $1';
        parameters.push(limit);
    }

    if(offset){
        query += ' OFFSET $2';
        parameters.push(offset);
    }

	db.query(query, parameters, function(err, result){
		if(err){
			logger.error("GroupDao findByAll error : " + err);
			return callback(err,null);
		}

		try{
			callback(null, resultToArray.toArray(fromDbObj, result.rows));
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
			throw new PlatformError(msg);
        	return;
    	}

		var defaultFound = fromDbObj(result);

		if(defaultFound == null){

			logger.debug("Inserting default group");
			var defaultGroup = new Group();
			defaultGroup.name = "Default";
			defaultGroup.description = "Default group";
			defaultGroup.isDefault = true;

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

GroupDao.prototype.deleteById = function(id, callback){
	//TODO where mac = x and is active.
	var query = 'DELETE FROM "group" where id = $1';

	db.query(query, [id], function(err, result){
		if(err){
			logger.error("GroupDao deleteById error : " + err);
			callback(err, null);
			return;
		}
		callback(null, result.rowCount);
	});
}

GroupDao.prototype.updateGroup = function(c, callback){
// id |  name   |      creation_date      |  description  | isdefault 
	var query = 'UPDATE "group" SET name = $1, creation_date = $2, description = $3, isdefault = $4 WHERE id = $8';

	if(c.isDefault === false)
    	c.isDefault = null;

	db.query(query, [c.name, c.creationDate, c.description, c.isDefault, c.id], function(err, result){
		if(err){
			logger.error("GroupDao updateGroup error : " + err);
			callback(err, null);
			return;
		}

		callback(null, result.rowCount);
	});
}

var fromDbObj = function(dbObj){

	if(!dbObj)
		return null;

	var group = new Group();
	group.id = dbObj.id;
	group.name = dbObj.name;
	group.creationDate = dbObj.creation_date;
    group.description = dbObj.description;

    if(dbObj.isDefault === null)
    	group.isDefault = false;
    else{
    	group.isDefault = dbObj.isdefault;
    }

    return group;
}

module.exports = GroupDao;