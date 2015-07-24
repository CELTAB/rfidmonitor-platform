var logger = require('winston');

var User = function(obj){

    if(obj){
        this.id = obj.id;
        this.name = obj.name;
        this.password = obj.password;
        this.email = obj.email;
        this.username = obj.username;

    }else{
        this.id = 0;
    	this.name = '';
    	this.password = '';
    	this.email = '';
        this.username = '';
    }

}

module.exports = User;