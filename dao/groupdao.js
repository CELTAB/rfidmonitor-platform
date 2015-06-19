var db = require('../models/database');
var Group = require('../models/group');

var GroupDao = function(){
	this.insertDefault();
}

GroupDao.prototype.insert = function(group, callback){

	if (false === (group instanceof Group)) {
        console.warn('Warning: GroupDao : group constructor called without "new" operator');
        return;
    }

    var query = 'INSERT INTO "group" (name, creation_date, description) VALUES ($1, $2, $3) RETURNING ID';

	db.query(query, [group.name, group.creation_date, group.description], function(err, result){
		if(err){
			console.log("GroupDao insert error : " + err);
			return callback(err,null);
		}

			var id = result.rows[0].id;		
			console.log("RFIDPLATFORM[DEBUG]: New group Inserted with ID: " + id);
			callback(null, id);
	});
}

GroupDao.prototype.findById = function(groupId, callback){

	var query = 'SELECT * FROM "group" WHERE id = $1';

	db.query(query, [groupId], function(err, result){
		if(err){
			console.log("GroupDao findById error : " + err);
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

	var query = 'SELECT * FROM "group" WHERE id=$1';
	db.query(query, [1], function(err, result){
		if(err){
			throw new Error("GroupDao getDefault error : " + err);
		}

		callback(null, buildFromSelectResult(result));
	});
}

var buildFromSelectResult = function(result){
	var founds = result.rows;
	if(founds.length == 0){
		return null;
	}
	// else if(founds.length > 1){
	// 	throw new Error("Unexpected Bahavior: More than one group found");
	// 	return;
	// }

	var group = new Group();
	group.id = result.rows[0].id;
	group.name = result.rows[0].name;
	group.creation_date = result.rows[0].creation_date;
    group.description = result.rows[0].description;

    return group;
}

GroupDao.prototype.insertDefault = function(){
	this.findById(1, function(err, found){

		if(err){
			console.log("GroupDao0: InsertDefault error.");
			return;
		}

		if(found == null){
			var defaultGroup = new Group();
			defaultGroup.id = 1;
			defaultGroup.name = "Default";
			defaultGroup.description = "Default group";

			try{
				GroupDao.prototype.insert(defaultGroup, function(err, id){
					if(err){
						console.log("GroupDao1: InsertDefault error.");
						return;
					}
					console.log("Default group inserted with ID " + id);
				});

			}catch(e){
				console.log("INSERT EXCEPTION: " + e);
			}
		}
	});
}

module.exports = GroupDao;