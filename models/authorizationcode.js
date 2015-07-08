//These are the codes generated in the first part of the OAuth2 flow. These codes are then used in later steps by getting exchanged for access tokens.

var AuthorizationCode = function(){
	//TODO It is also worth noting, that to be extra secure, you should consider hashing the authorization code.
	this.id = null;
	this.value; // this is the authorization code
	this.redirectUri; // is there to store the redirect uri supplied in the initial authorization process so we can add a bit more security later on to make sure the token exchange is legitimate
	this.userId;
}

module.exports = AuthorizationCode;
