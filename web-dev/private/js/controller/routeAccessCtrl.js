/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('routeAccessCtrl', function($scope, $location, $timeout, Restangular, roles){

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
         routesView[role.group][role.type] = {"key": $index, "checked": false, "description": role.description, "ids": []};
         angular.forEach(role.depends, function(depend){
           routesView[role.group][role.type].ids.push(routesMap[depend.path][depend.method]);
         });
       });

      //  angular.forEach(viewRoles, function(role){
      //    var permission = true;
      //    angular.forEach(role.depends, function(depend){
      //      if(!permission) return;
      //      var userPermission = false;
      //      angular.forEach(routesChecked, function(userRole){
      //        if(userPermission) return;
      //        if(depend.path === userRole.path && depend.method === userRole.method){
      //          userPermission = true;
      //        }
      //      });
      //      permission = userPermission;
      //    });
      //    role.permission = permission;
      //  });
       //
      //  angular.forEach(routesView, function(routeView){
      //    angular.forEach(routeView, function(type){
      //      type.checked = viewRoles[type.key].permission;
      //    });
      //  });

      processPermissions(routesChecked);
      $scope.routesView = routesView;

    });
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

    // angular.forEach(viewRoles, function(role){
    //   var permission = true;
    //   angular.forEach(role.depends, function(depend){
    //     if(!permission) return;
    //     var userPermission = false;
    //     angular.forEach(checked, function(userRole){
    //       if(userPermission) return;
    //       if(depend.path === userRole.path && depend.method === userRole.method){
    //         userPermission = true;
    //       }
    //     });
    //     permission = userPermission;
    //   });
    //   role.permission = permission;
    // });
    //
    // angular.forEach(routesView, function(routeView){
    //   angular.forEach(routeView, function(type){
    //     type.checked = viewRoles[type.key].permission;
    //   });
    // });

    processPermissions(checked);
  };

  loadUsers();

});
