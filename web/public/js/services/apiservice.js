var apiService = angular.module("rfidplatform");

apiService.factory("loginService", function($http, config){

	var _setToken = function(token){
		console.log("Setting Token to " + token);
		config.token = token;
		$http.defaults.headers.common.Authorization = 'Bearer ' + token;
	};

	var _postLogin = function(credentials){
		return $http.post(config.baseWebUrl + "/login", credentials);
	};

	var _postLogout = function(){
		return $http.post(config.baseWebUrl + "/logout");
	}

	return {
		login: _postLogin,
		setToken: _setToken,
		logout: _postLogout
	};
});

apiService.factory("clientService", function($http, config){

	var clientUrl = config.baseApiUrl + "/clients";

	var _getClients = function(){
		return $http.get(clientUrl);
	};

	var _saveClient = function(client){
		return $http.post(clientUrl, client);
	};

	var _removeClient = function(param) {
		return $http.delete(clientUrl, param);
	};

	return {
		getClients: _getClients,
		saveClient: _saveClient,
		removeClient: _removeClient
	}
});
