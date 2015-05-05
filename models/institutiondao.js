var db = require('./database');
var Institution = require('./institution');

var InstitutionDao = function(){

}

InstitutionDao.prototype.insert = function(obj, callback){

	if (false === (obj instanceof Institution)) {
        console.warn('Warning: InstitutionDao : obj constructor called without "new" operator');
        return;
    }

	// REMEMBER TO VALIDATE THE SQL STRING
	// VALIDATE OBJ

	var query = "INSERT INTO INSTITUTION (NAME, LAT, LNG, DATE) VALUES ($1, $2, $3, $4) RETURNING ID";


	db.query(query, [obj.name, obj.lat, obj.lng, obj.date], function(err, result){
		callback(err, result);
	});
}

module.exports = InstitutionDao;