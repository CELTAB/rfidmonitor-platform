var logger = require('winston');
var Sequelize = require('sequelize');

var PlatformSequelize = function PlatformSequelize(){

	var connectionString = 'postgres://rfidplatform:rfidplatform@localhost:5432/rfidplatform';
	var sequelize = new Sequelize(connectionString);

    sequelize.sync({force: true});

	this.getSequelize = function(){
		return sequelize;
	}
 
    if(PlatformSequelize.caller != PlatformSequelize.getInstance){
        throw new PlatformError("This object cannot be instanciated");
    }
}
 
PlatformSequelize.instance = null;
 

PlatformSequelize.getInstance = function(){
    if(this.instance === null){
        this.instance = new PlatformSequelize();
    }
    return this.instance;
}
 
module.exports = PlatformSequelize.getInstance().getSequelize();