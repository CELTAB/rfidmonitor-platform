var db = require('./database');
var Group = require('./group');
var logger = require('winston');

var GroupDao = function(){

}

GroupDao.prototype.insert = function(obj, callback){

	if (false === (obj instanceof Group)) {
        logger.warn('Warning: GroupDao : obj constructor called without "new" operator');
        return;
    }

	// REMEMBER TO VALIDATE THE SQL STRING
	// VALIDATE OBJ

	var query = "INSERT INTO \"group\" (name, lat, lng, creation_date) VALUES ($1, $2, $3, $4) RETURNING ID";


	db.query(query, [obj.name, obj.lat, obj.lng, obj.creationDate], function(err, result){
		callback(err, result);
	});
}

module.exports = GroupDao;