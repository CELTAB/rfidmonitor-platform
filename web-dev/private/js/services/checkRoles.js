/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.factory('checkRoles', function (roles) {

  var userRoles = angular.fromJson(localStorage.getItem('flexUser')).routes;
  var viewRoles = angular.copy(roles);
  var entitiesName = [];

  angular.forEach(userRoles, function(userRole){
    if(viewRoles.admin.permission) return;
    if(userRole.path === 'ANY' && userRole.method === 'ANY'){
      viewRoles.admin.permission = true;
    }
    if(userRole.path.indexOf('/api/dao/') > -1){
      var entityName = userRole.path.split('/')[3];
      if(entitiesName.indexOf(entityName) === -1){
        entitiesName.push(entityName);
      }
    }
  });

  if(!viewRoles.admin.permission){
    angular.forEach(entitiesName, function(entity){
      var entityUpper = entity.charAt(0).toUpperCase() + entity.slice(1);
      viewRoles["list-"+entity] = {"description": "Menu de "+entityUpper, "group": entityUpper, "type": "list", "permission": false, "depends": [
             {"path": "/api/dao/"+entity, "method": "GET"},{"path":"/api/dynamic", "method": "GET"}]};
      viewRoles["add-"+entity] = {"description": "Adicionar "+entityUpper, "group": entityUpper, "type": "add", "permission": false, "depends": [
             {"path": "/api/dao/"+entity, "method": "POST"},{"path": "/api/dao/"+entity, "method": "GET"},{"path":"/api/dynamic", "method": "GET"}]};
      viewRoles["edit-"+entity] = {"description": "Editar "+entityUpper, "group": entityUpper, "type": "edit", "permission": false, "depends": [
           {"path": "/api/dao/"+entity, "method": "PUT"},{"path": "/api/dao/"+entity, "method": "GET"},{"path":"/api/dynamic", "method": "GET"}]};
      viewRoles["remove-"+entity] = {"description": "Remover "+entityUpper, "group": entityUpper, "type": "remove", "permission": false, "depends": [
            {"path": "/api/dao/"+entity, "method": "DELETE"},{"path": "/api/dao/"+entity, "method": "GET"},{"path":"/api/dynamic", "method": "GET"}]};
    });
  }

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
