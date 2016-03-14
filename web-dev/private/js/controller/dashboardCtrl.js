/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('dashboardCtrl', function($scope, Restangular){

	var collectorsService = Restangular.service('collectors');


  $scope.getCollectors = function(){
    collectorsService.getList().then(function(response){
  		 $scope.collectors = response;
  	});
  }

	$scope.getCollectors();

});
