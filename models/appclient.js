var AppClient = function(){

	//TODO In this post we aren’t adding any encryption, but it would be a good practice to hash the secret at the very least. 
	//TODO You could also consider auto generating the client id and secret in order to enforce uniqueness, randomness, and strength.

	/*We have a name to help identify the application client.*/
	this.name; //unique

	/*The id and secret are used as part of the OAuth2 flow and should always be kept secret.*/
	this.id;
	this.secret; // should be hashed

	/*Finally we have a userId field to identify which user owns this application client.*/
	this.userId;	
}

module.exports = AppClient;