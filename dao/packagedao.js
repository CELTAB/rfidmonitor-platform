var db = require('../utils/database');
var Package = require('../models/package');

var PackageDao = function(){

}

PackageDao.prototype.insert = function(ObjPackage, callback){

	if (false === (ObjPackage instanceof Package)) {
        console.warn('Warning: PackageDao : Package constructor called without "new" operator');
        return;
    }

	var query = 'INSERT INTO "package" (package_hash, timestamp, package_size) VALUES ($1, $2, $3) RETURNING ID';
	
	db.query(query, [ObjPackage.package_hash, ObjPackage.timestamp, ObjPackage.package_size], function(err, result){

		if(err){
			console.log("PackageDao insert error : " + err);
			return callback(err,null);
		}

		var id = result.rows[0].id;		
		callback(null, id);
	});
}

PackageDao.prototype.findByHash = function(package_hash, callback){

	var queryFind = 'SELECT * FROM "package" WHERE package_hash = $1';

	db.query(queryFind, [package_hash], function(err, result){

		if(err){
			console.log("PackageDao findByHash error : " + err);
			return callback(err,null);
		}

		try{
			var pkObj = buildFromSelectResult(result);
			callback(null, pkObj);
		}catch(e){
			callback(e, null);
		}
	});
}

var buildFromSelectResult = function(result){
	var founds = result.rows;
	if(founds.length == 0){
		return null;
	}
	// else if(founds.length > 1){
	// 	throw new Error("Unexpected Bahavior: More than one package found");
	// 	return;
	// }

	var pk = new Package();
	pk.id = result.rows[0].id;
	pk.package_hash = result.rows[0].package_hash;
	pk.timestamp = result.rows[0].timestamp;
    pk.package_size = result.rows[0].package_size;

    return pk;
}

module.exports = PackageDao;