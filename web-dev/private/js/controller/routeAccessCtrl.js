/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('routeAccessCtrl', function($scope, $location, $timeout, Restangular){

  var routesService = Restangular.service('routes');
  var usersService = Restangular.service('users');
  var appClientsService = Restangular.service('appclients');
  var routeAccessService = Restangular.service('routeaccess');

  $scope.mapRoutes = [];
  $scope.loadding = false;

  var loadUsers = function(){
    usersService.getList().then(function(response){
       $scope.users = response.plain();
    });
  };

  var loadRoutes = function(routesChecked){
    routesService.getList().then(function(response){
       $scope.routes = response.plain();
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
    if(appClientId !== ""){
      var query = {};
      query.q = {};
      query.q.include = [{"all": true}];
      query.q.where = {};
      query.q.where.appClient = appClientId;
      $scope.loadding = true;

      routeAccessService.getList(query).then(function(response){
        $scope.loadding = false;
        var checked = [];
        angular.forEach(response, function(value){
            checked.push(value.uriRoute);
        });
        loadRoutes(checked);
      }, function(response){
        $scope.loadding = false;
      });
    }
  };

  $scope.getAppClients = function(userId){
    if(userId !== ""){
      var query = {};
      query.q = {};
      query.q.where = {};
      query.q.where.userId = userId;

      appClientsService.getList(query).then(function(response){
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
