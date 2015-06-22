var logger = require('winston');

var Group = function(){

    this.id = 0;
	this.name = '';
	this.creation_date = new Date();
    this.description = '';
    this.isdefault = null;
}

module.exports = Group;