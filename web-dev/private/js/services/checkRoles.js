/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.factory('checkRoles', function () {
  var userRoles = angular.fromJson(localStorage.getItem('flexUser')).routes;

  // @TODO movie json to external file
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
        {"path":"/api/de/original", "method": "GET"},
        {"path":"/api/de/meta", "method": "GET"}]},
    "active-dynamicEntities" : {"permission": false, "depends": [
        {"path":"/api/de/original", "method": "GET"},
        {"path":"/api/de/meta", "method": "GET"},
        {"path":"/api/de/activate", "method": "PUT"},
        {"path":"/api/de/deactivate", "method": "PUT"}]},
    "add-dynamicEntities" : {"permission": false, "depends": [
        {"path":"/api/de/register", "method": "GET"}]},
    "menu-dashboard" : {"permission": false, "depends": [
        {"path":"/api/collectors", "method": "GET"}]},
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
        {"path":"/api/de/meta", "method": "GET"},
        {"path":"/api/de/dao", "method": "GET"}]},
    "menu-importfile" : {"permission": false, "depends": [
        {"path":"/api/import", "method": "POST"}]},
    "menu-dynamic" : {"permission": false, "depends": [
        {"path":"/api/de/meta", "method": "GET"},
        {"path":"/api/de/dao", "method": "GET"},
        {"path":"/api/media", "method": "GET"}]},
    "add-dynamic" : {"permission": false, "depends": [
        {"path":"/api/de/meta", "method": "GET"},
        {"path":"/api/de/dao", "method": "GET"},
        {"path":"/api/de/dao", "method": "POST"},
        {"path":"/api/media", "method": "GET"},
        {"path":"/api/media", "method": "POST"}]},
    "edit-dynamic" : {"permission": false, "depends": [
        {"path":"/api/de/meta", "method": "GET"},
        {"path":"/api/de/dao", "method": "GET"},
        {"path":"/api/de/dao", "method": "PUT"},
        {"path":"/api/media", "method": "GET"},
        {"path":"/api/media", "method": "POST"}]},
    "remove-dynamic" : {"permission": false, "depends": [
        {"path":"/api/de/meta", "method": "GET"},
        {"path":"/api/de/dao", "method": "GET"},
        {"path":"/api/de/dao", "method": "DELETE"}]}
  };

  angular.forEach(userRoles, function(userRole){
    if(viewRoles.admin) return;
    if(userRole.path === 'ANY' && userRole.method === 'ANY'){
      viewRoles.admin = true;
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

  return function(role) {

    if(viewRoles.admin){
      return true;
    }
    return viewRoles[role].permission;
  };
});
