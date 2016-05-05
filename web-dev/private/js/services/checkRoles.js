/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.factory('checkRoles', function (Restangular) {
  var userRoles = angular.fromJson(localStorage.getItem('flexUser')).routes;

  // @TODO move json to external file
  var viewRoles = {
  "admin" : false,
  "menu-users" : {"permission": false, "depends": [
      {"path":"/api/users", "method": "GET"}]},
  "add-users" : {"permission": false, "depends": [
      {"path":"/api/users", "method": "POST"}]},
  "edit-users" : {"permission": false, "depends": [
      {"path":"/api/users", "method": "PUT"}]},
  "remove-users" : {"permission": false, "depends": [
      {"path":"/api/users", "method": "DELETE"}]},
  "menu-appclients" : {"permission": false, "depends": [
      {"path":"/api/appclients", "method": "GET"}]},
  "add-appclients" : {"permission": false, "depends": [
      {"path":"/api/appclients", "method": "POST"},
    {"path":"/api/users", "method": "GET"}]},
  "edit-appclients" : {"permission": false, "depends": [
      {"path":"/api/appclients", "method": "PUT"}]},
  "remove-appclients" : {"permission": false, "depends": [
      {"path":"/api/appclients", "method": "DELETE"}]},
  "menu-routeaccess" : {"permission": false, "depends": [
      {"path":"/api/users", "method": "GET"},
      {"path":"/api/appclients", "method": "GET"},
      {"path":"/api/routes", "method": "GET"},
      {"path":"/api/routeaccess", "method": "GET"},
      {"path":"/api/routeaccess", "method": "POST"}]},
  "menu-dynamicEntities" : {"permission": false, "depends": [
      {"path":"/api/dynamic", "method": "GET"}]},
  "active-dynamicEntities" : {"permission": false, "depends": [
      {"path":"/api/dynamic", "method": "GET"},
      {"path":"/api/dynamic", "method": "PUT"}]},
  "deactive-dynamicEntities" : {"permission": false, "depends": [
      {"path":"/api/dynamic", "method": "GET"},
      {"path":"/api/dynamic", "method": "DELETE"}]},
  "add-dynamicEntities" : {"permission": false, "depends": [
      {"path":"/api/dynamic", "method": "GET"},
      {"path":"/api/dynamic", "method": "POST"}]},
  "menu-dashboard" : {"permission": false, "depends": [
      {"path":"/api/dashboard", "method": "GET"}]},
  "menu-groups" : {"permission": false, "depends": [
      {"path":"/api/groups", "method": "GET"}]},
  "add-groups" : {"permission": false, "depends": [
      {"path":"/api/groups", "method": "POST"}]},
  "edit-groups" : {"permission": false, "depends": [
      {"path":"/api/groups", "method": "PUT"}]},
  "remove-groups" : {"permission": false, "depends": [
      {"path":"/api/groups", "method": "DELETE"}]},
  "menu-collectors" : {"permission": false, "depends": [
      {"path":"/api/collectors", "method": "GET"},
      {"path":"/api/groups", "method": "GET"}]},
  "add-collectors" : {"permission": false, "depends": [
      {"path":"/api/collectors", "method": "POST"},
      {"path":"/api/groups", "method": "GET"}]},
  "edit-collectors" : {"permission": false, "depends": [
      {"path":"/api/collectors", "method": "PUT"},
      {"path":"/api/groups", "method": "GET"}]},
  "remove-collectors" : {"permission": false, "depends": [
      {"path":"/api/collectors", "method": "PUT"},
      {"path":"/api/groups", "method": "GET"},
      {"path":"/api/collectors", "method": "DELETE"}]},
  "menu-rfiddata" : {"permission": false, "depends": [
      {"path":"/api/rfiddatas", "method": "GET"},
      {"path":"/api/collectors", "method": "GET"},
      {"path":"/api/groups", "method": "GET"},
      {"path":"/api/dynamic", "method": "GET"}]},
  "menu-importfile" : {"permission": false, "depends": [
      {"path":"/api/import", "method": "POST"}]},
  "menu-dynamic" : {"permission": false, "depends": [
      {"path":"/api/dynamic", "method": "GET"}]},
};

  angular.forEach(userRoles, function(userRole){
    if(viewRoles.admin) return;
    if(userRole.path === 'ANY' && userRole.method === 'ANY'){
      viewRoles.admin = true;
    }
    if (userRole.path.indexOf('/api/dao/') !== -1) {
      var identifier = userRole.path.split('/')[3];

      viewRoles["menu-"+identifier] = {"permission": false, "depends": [
             {"path": userRole.path, "method": "GET"}]};
      viewRoles["add-"+identifier] = {"permission": false, "depends": [
             {"path": userRole.path, "method": "POST"}]};
      viewRoles["edit-"+identifier] = {"permission": false, "depends": [
           {"path": userRole.path, "method": "PUT"}]};
      viewRoles["remove-"+identifier] = {"permission": false, "depends": [
            {"path": userRole.path, "method": "DELETE"}]};
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

  return function(role, dynamic) {
    if(viewRoles.admin)
      return true;

    if (dynamic) {
      var key = role + '-' + dynamic.split('/')[1];
      return viewRoles[key].permission;
    } else {
      return viewRoles[role].permission;
    }
  };
});
