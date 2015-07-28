var db = require('../utils/database');
var Package = require('../models/package');
var logger = require('winston');
var PlatformError = require('../utils/platformerror');

var PackageDao = function(){

}

PackageDao.prototype.insert = function(ObjPackage, callback){

	if (false === (ObjPackage instanceof Package)) {
        var msg = 'PackageDao : Package constructor called without "new" operator';
		throw new PlatformError(msg);
        return;
    }

	var query = 'INSERT INTO "package" (package_hash, timestamp, package_size) VALUES ($1, $2, $3) RETURNING ID';
	
	db.query(query, [ObjPackage.packageHash, ObjPackage.timestamp, ObjPackage.packageSize], function(err, result){

		if(err){
			logger.error("PackageDao insert error : " + err);
			return callback(err,null);
		}

		var id = result.rows[0].id;		
		callback(null, id);
	});
}

PackageDao.prototype.findByHash = function(packageHash, callback){

	var queryFind = 'SELECT * FROM "package" WHERE package_hash = $1';

	db.query(queryFind, [packageHash], function(err, result){

		if(err){
			logger.error("PackageDao findByHash error : " + err);
			return callback(err,null);
		}

		if(result.rows.length > 1){
			var msg = 'Unexpected Bahavior: More than one package found';
			throw new PlatformError(msg);
	        return;
		}

		try{
			var pkObj = fromDbObj(result.rows[0]);
			callback(null, pkObj);
		}catch(e){
			callback(e, null);
		}
	});
}

var fromDbObj = function(dbObj){

	if(!dbObj)
		return null;

	var pk = new Package();
	pk.id = dbObj.id;
	pk.packageHash = dbObj.package_hash;
	pk.timestamp = dbObj.timestamp;
    pk.packageSize = dbObj.package_size;

    return pk;
}

module.exports = PackageDao;