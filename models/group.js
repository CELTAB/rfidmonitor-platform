var logger = require('winston');

var Group = function(obj){

	if(obj){
		this.id = obj.id;
		this.name = obj.name;
		this.creationDate = new Date();
	    this.description = obj.description;
	    this.isDefault = obj.isDefault;
	}else{
	    this.id = 0;
		this.name = '';
		this.creationDate = new Date();
	    this.description = '';
	    this.isDefault = null;		
	}

}

module.exports = Group;