/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('routeAccessCtrl', function($scope, $location, $timeout, $uibModal, Restangular, roles){

  var routesService = Restangular.service('routes');
  var usersService = Restangular.service('users');
  var appClientsService = Restangular.service('appclients');
  var routeAccessService = Restangular.service('routeaccess');

  var routesMap = {};
  var routesView = {};
  var viewRoles = angular.copy(roles);

  $scope.loadding = false;

  var loadUsers = function(){
    usersService.getList().then(function(response){
       $scope.users = response.plain();
    });
  };

  var loadRoutes = function(routesChecked){

    routesService.getList().then(function(response){
       var routes = response.plain();

       angular.forEach(routes, function(route){
          if(!routesMap[route.path]){
            routesMap[route.path] = {};
          }
          routesMap[route.path][route.method] = route.id;
          routesMap[route.id] = {"path": route.path, "method": route.method};
       });

       angular.forEach(viewRoles, function(role, $index){
         if(!routesView[role.group]){
           routesView[role.group] = {};
         }
         routesView[role.group][role.type] = {"key": $index, "checked": false, "description": role.description, "ids": [], "dependsKeys": [], "dependsMeKeys": []};
         angular.forEach(role.depends, function(depend){
           routesView[role.group][role.type].ids.push(routesMap[depend.path][depend.method]);
         });
       });

      processPermissions(routesChecked);

      angular.forEach(routesView, function(route){
        angular.forEach(route, function(type){
            angular.forEach(routesView, function(route2){
              angular.forEach(route2, function(type2){
                if(type.ids !== type2.ids){
                  if(checkContains(type.ids, type2.ids)){
                    type.dependsMeKeys.push(type2.key);
                    type2.dependsKeys.push(type.key);
                  }
                }
              });
            });
        });
      });

      $scope.routesView = routesView;

    });
  };

  var checkContains = function(arrayA, arrayB){
    for (var i = 0; i < arrayA.length; i++) {
      var result = arrayB.indexOf(arrayA[i]);
      if(result === -1) return false;
    }
    return true;
  };

  var processPermissions = function(routesChecked){
    angular.forEach(viewRoles, function(role){
      var permission = true;
      angular.forEach(role.depends, function(depend){
        if(!permission) return;
        var userPermission = false;
        angular.forEach(routesChecked, function(userRole){
          if(userPermission) return;
          if(depend.path === userRole.path && depend.method === userRole.method){
            userPermission = true;
          }
        });
        permission = userPermission;
      });
      role.permission = permission;
    });

    angular.forEach(routesView, function(routeView){
      angular.forEach(routeView, function(type){
        type.checked = viewRoles[type.key].permission;
      });
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
            checked.push({
              "id": value.uriRoute,
              "path": value.UriRoute.path,
              "method": value.UriRoute.method
            });
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
    var routesMapControl = {};
    angular.forEach(routesView, function(value){
      angular.forEach(value, function(role){
          if(role.checked){
            angular.forEach(role.ids, function(id){
              if(!routesMapControl[id]){
                routesMapControl[id] = true;
                routes.push({"appClient": appClientId, "uriRoute": id});
              }
            });
          }
      });
    });

    routeAccessService.post(routes).then(function(response){
      $scope.successMessage = 'Salvo com Sucesso!';
      $timeout(function() {
        $scope.successMessage = false;
      }, 3000);
    }, function(response) {
      $scope.errorMessage = response.data;
    });
  };

  $scope.check = function(key, check){
    var checked = [];
    var checkedMapControl = {};
    angular.forEach($scope.routesView, function(routeView){
      angular.forEach(routeView, function(route){
        if(route.checked){
          angular.forEach(route.ids, function(id){
            if(!checkedMapControl[id]){
              checkedMapControl[id] = true;
              var ch = {
                "id": id,
                "path": routesMap[id].path,
                "method": routesMap[id].method
              };
              checked.push(ch);
            }
          });
        }
      });
    });

    processPermissions(checked);
  };

  $scope.openDepends = function (titleKey, dependsKeys, dependsMeKeys) {

    var dependsValues = [];
    var dependsMeValues = [];
    var titleValue = viewRoles[titleKey].description;

    angular.forEach(dependsKeys, function(depend){
      dependsValues.push(viewRoles[depend].description);
    });

    angular.forEach(dependsMeKeys, function(depend){
      dependsMeValues.push(viewRoles[depend].description);
    });

    $uibModal.open({
      templateUrl: 'view/modal/dependsModal.html',
      controller: 'dependsCtrl',
      resolve: {
        title: function () {
          return titleValue;
        },
        depends: function () {
          return dependsValues;
        },
        dependsMe: function () {
          return dependsMeValues;
        }
      }
     });
  };

  loadUsers();

});
