/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('routeAccessCtrl', function($scope, Restangular){

  var routesService = Restangular.service('routes');
  var usersService = Restangular.service('users');

  routesService.getList().then(function(response){
		 $scope.routes = response;
	});

  routesService.getList().then(function(response){
		 $scope.routes = response;
	});

  

});
