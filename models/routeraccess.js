var RouterAccess = function(obj){

	if(obj){
		this.id = obj.id;
	    this.appClientId = obj.appClientId; 
	    this.uriRoutersId = obj.uriRoutersId;
	}else{
	    this.id = null;
	    this.appClientId; 
	    this.uriRoutersId;
	}
}
module.exports = RouterAccess;