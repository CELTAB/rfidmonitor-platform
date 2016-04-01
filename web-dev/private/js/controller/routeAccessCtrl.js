/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('routeAccessCtrl', function($scope, $location, $timeout, Restangular){

  var routesService = Restangular.service('routes');
  var usersService = Restangular.service('users');
  var appClientsService = Restangular.service('appClients');
  var routeAccessService = Restangular.service('routeaccess');

  $scope.mapRoutes = [];

  var loadUsers = function(){
    usersService.getList().then(function(response){
       $scope.users = response;
    });
  };

  var loadRoutes = function(routesChecked){
    routesService.getList().then(function(response){
       $scope.routes = response;
       var routesView = {};

       angular.forEach($scope.routes, function(route){
          if(!routesView[route.path]){
            routesView[route.path] = {};
          }
          if(routesChecked.indexOf(route.id) > -1){
            routesView[route.path][route.method] = {"id": route.id, checked: true};
          }else{
           routesView[route.path][route.method] = {"id": route.id, checked: false};
          }
       });
       $scope.routesView = routesView;
    });
  };

  $scope.getRoutes = function(appClientId){
    routeAccessService.getList({q: {"include":{"all": true}, "where": {"appClient": appClientId}}}).then(function(response){
      var checked = [];
      angular.forEach(response, function(value){
          checked.push(value.uriRoute);
      });
      loadRoutes(checked);
    });

  };

  $scope.getAppClients = function(userId){
    if(userId !== ""){
      appClientsService.getList({q: {"where":{"userId": userId}}}).then(function(response){
         $scope.appClients = response;
      });
    }
  };

  $scope.save = function(appClientId){

    var routesView = angular.copy($scope.routesView);
    var routes = [];
    angular.forEach(routesView, function(value){
      angular.forEach(value, function(uri){
          if(uri.checked){
            routes.push({"appClient": appClientId, "uriRoute": uri.id});
          }
      });
    });

    routeAccessService.post(routes).then(function(response){
      $scope.successMessage = 'Salvo com Sucesso!';
      $timeout(function() {
        $location.path( "/dashboard" );
      }, 1500);
    }, function(response) {
      $scope.errorMessage = response.data;
    });
  };

  loadUsers();

});
