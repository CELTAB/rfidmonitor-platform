/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('routeAccessCtrl', function($scope, $location, $timeout, Restangular){

  var routesService = Restangular.service('routes');
  var appClientsService = Restangular.service('appClients');
  var routeAccessService = Restangular.service('routeaccess');

  var loadAppClients = function(){
    appClientsService.getList({q: {"include":[{"all":true}]}}).then(function(response){
       $scope.appClients = response;
    });
  };

  var loadRoutes = function(){
    routesService.getList({q: {"where":{"path":"ANY"}}}).then(function(response){
       $scope.routes = response;
    });
  };

  $scope.save = function(entity){
    // @TODO temporary code
    routeAccessService.post([$scope.entity]).then(function(response){
      $scope.successMessage = 'Salvo com Sucesso!';
      $timeout(function() {
        $location.path( "/dashboard" );
      }, 1500);
    }, function(response) {
      $scope.errorMessage = response.data;
    });
  };

  loadRoutes();
  loadAppClients();

});
