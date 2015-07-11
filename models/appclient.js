var AppClient = function(){

	//TODO In this post we aren’t adding any encryption, but it would be a good practice to hash the secret at the very least. 
	//TODO You could also consider auto generating the client id and secret in order to enforce uniqueness, randomness, and strength.

	this.id = null;

	/*We have a name to help identify the application client.*/
	this.clientName; //unique
	this.authSecret; // should be hashed
	this.description = '';
}

module.exports = AppClient;