var AccessToken = function(){
	this.id = null;
	this.value; //It is the actual token value used when accessing the API on behalf of the user.
	this.appClientId;
}
module.exports = AccessToken;