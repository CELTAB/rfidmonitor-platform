var angularConfig = angular.module("rfidplatform");

angularConfig.value("config", {
	baseAdminUrl: "https://localhost:443/admin",
	baseApiUrl: "https://localhost:443/api"
});

angularConfig.config(function($routeProvider, $locationProvider, $httpProvider) {

	$httpProvider.interceptors.push('httpInterceptor');

	$routeProvider.when("/home", {
		templateUrl: "view/home.html",
		controller: "homeCtrl",
	});
	$routeProvider.when("/noAccess", {
		templateUrl: "view/noAccess.html"
	});
	$routeProvider.when("/clients", {
		templateUrl: "view/clients.html",
		controller: "clientsCtrl",
		resolve: {
			clients: function(clientService){
				return clientService.getClients();
			}
		}
	});
	$routeProvider.when("/login", {
		templateUrl: "view/login.html",
		controller: "loginCtrl"
	});
	$routeProvider.when("/", {
		redirectTo: "/login"
	});
	$routeProvider.otherwise({redirectTo: "/"});
});

