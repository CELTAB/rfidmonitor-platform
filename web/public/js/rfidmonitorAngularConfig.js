var angularConfig = angular.module("rfidplatform");

angularConfig.value("config", {
	baseWebUrl: "https://localhost:443/web",
	baseApiUrl: "https://localhost:443/api"
});

angularConfig.config(function($routeProvider, $locationProvider, $httpProvider) {

	$httpProvider.interceptors.push('httpInterceptor');

	$routeProvider.when("/home", {
		templateUrl: "web/home.html",
		controller: "homeCtrl",
	});
	$routeProvider.when("/noAccess", {
		templateUrl: "web/noAccess.html"
	});
	$routeProvider.when("/clients", {
		templateUrl: "web/clients.html",
		controller: "clientsCtrl",
		resolve: {
			clients: function(clientService){
				console.log("Resolving clients");
				return clientService.getClients();
			}
		}
	});
	$routeProvider.when("/login", {
		templateUrl: "web/login.html",
		controller: "loginCtrl"
	});
	// $routeProvider.otherwise({redirectTo: "/"});
});

