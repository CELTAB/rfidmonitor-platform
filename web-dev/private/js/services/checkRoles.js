/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.factory('checkRoles', function (roles) {

  var userRoles = angular.fromJson(localStorage.getItem('flexUser')).routes;
  var viewRoles = angular.copy(roles);

  angular.forEach(userRoles, function(userRole){
    if(viewRoles.admin.permission) return;
    if(userRole.path === 'ANY' && userRole.method === 'ANY'){
      viewRoles.admin.permission = true;
    }
  });

  if(!viewRoles.admin.permission){
    angular.forEach(viewRoles, function(role){
      var permission = true;
      angular.forEach(role.depends, function(depend){
        if(!permission) return;
        var userPermission = false;
        angular.forEach(userRoles, function(userRole){
          if(userPermission) return;
          if(depend.path === userRole.path && depend.method === userRole.method){
            userPermission = true;
          }
        });
        permission = userPermission;
      });
      role.permission = permission;
    });
  }

  var _check = function(role, dynamic) {
    if(viewRoles.admin.permission){
      return true;
    }
    if(dynamic) {
      var key = role + '-' + dynamic.split('/')[1];
      return viewRoles[key].permission;
    } else {
      return viewRoles[role].permission;
    }
  };

  return _check;
});
