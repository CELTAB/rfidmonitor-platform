/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.factory('roles', function ($q, Restangular) {

  var roles = {
    "admin" : {"description": "Adminstrador", "group": "Admin", "type": "ANY", "permission": false,
      "depends": [{"path":"ANY", "method": "ANY"}]},
    "menu-users" : {"description": "Menu de Usuários", "group": "Usuário", "type": "list", "permission": false,
      "depends": [{"path":"/api/users", "method": "GET"}]},
    "add-users" : {"description": "Adicionar Usuário", "group": "Usuário", "type": "add", "permission": false,
      "depends": [{"path":"/api/users", "method": "POST"}]},
    "edit-users" : {"description": "Editar Usuário", "group": "Usuário", "type": "edit", "permission": false,
      "depends": [{"path":"/api/users", "method": "PUT"}]},
    "remove-users" : {"description": "Remover Usuário", "group": "Usuário", "type": "remove", "permission": false,
      "depends": [{"path":"/api/users", "method": "DELETE"}]},
    "menu-appclients" : {"description": "Menu de Clientes da Aplicação", "group": "Clientes da Aplicação", "type": "list", "permission": false,
      "depends": [{"path":"/api/appclients", "method": "GET"}]},
    "add-appclients" : {"description": "Adicionar Cliente da Aplicação", "group": "Clientes da Aplicação", "type": "add", "permission": false,
      "depends": [{"path":"/api/appclients", "method": "POST"},
        {"path":"/api/users", "method": "GET"}]},
    "edit-appclients" : {"description": "Editar Cliente da Aplicação", "group": "Clientes da Aplicação", "type": "edit", "permission": false,
      "depends": [{"path":"/api/appclients", "method": "PUT"}]},
    "remove-appclients" : {"description": "Remover Cliente da Aplicação", "group": "Clientes da Aplicação", "type": "remove", "permission": false,
      "depends": [{"path":"/api/appclients", "method": "DELETE"}]},
    "menu-routeaccess" : {"description": "Editar Rotas de Acesso", "group": "Rotas de Acesso", "type": "edit", "permission": false,
      "depends": [{"path":"/api/users", "method": "GET"},
        {"path":"/api/appclients", "method": "GET"},
        {"path":"/api/routes", "method": "GET"},
        {"path":"/api/routeaccess", "method": "GET"},
        {"path":"/api/routeaccess", "method": "POST"}]},
    "menu-dynamicEntities" : {"description": "Menu Entidades Dinâmicas", "group": "Entidades Dinâmicas", "type": "list", "permission": false,
      "depends": [{"path":"/api/dynamic", "method": "GET"}]},
    "add-dynamicEntities" : {"description": "Adicionar Entidade Dinâmica", "group": "Entidades Dinâmicas", "type": "add", "permission": false,
      "depends": [{"path":"/api/dynamic", "method": "GET"},
        {"path":"/api/dynamic", "method": "POST"}]},
    "active-dynamicEntities" : {"description": "Ativar Entidade Dinâmica", "group": "Entidades Dinâmicas", "type": "edit", "permission": false,
      "depends": [{"path":"/api/dynamic", "method": "GET"},
        {"path":"/api/dynamic", "method": "PUT"}]},
    "deactive-dynamicEntities" : {"description": "Desativar Entidade Dinâmica", "group": "Entidades Dinâmicas", "type": "remove", "permission": false,
      "depends": [{"path":"/api/dynamic", "method": "GET"},
        {"path":"/api/dynamic", "method": "DELETE"}]},
    "menu-dashboard" : {"description": "Menu Dashboard", "group": "Dashboard", "type": "list", "permission": false,
      "depends": [{"path":"/api/dashboard", "method": "GET"}]},
    "menu-groups" : {"description": "Menu de Grupos", "group": "Grupos", "type": "list", "permission": false,
      "depends": [{"path":"/api/groups", "method": "GET"}]},
    "add-groups" : {"description": "Adicionar Grupo", "group": "Grupos", "type": "add", "permission": false,
      "depends": [{"path":"/api/groups", "method": "GET"},
        {"path":"/api/groups", "method": "POST"}]},
    "edit-groups" : {"description": "Editar Grupo", "group": "Grupos", "type": "edit", "permission": false,
      "depends": [{"path":"/api/groups", "method": "GET"},
        {"path":"/api/groups", "method": "PUT"}]},
    "remove-groups" : {"description": "Remover Grupo", "group": "Grupos", "type": "remove", "permission": false,
      "depends": [{"path":"/api/groups", "method": "GET"},
        {"path":"/api/groups", "method": "DELETE"}]},
    "menu-collectors" : {"description": "Menu de Coletores", "group": "Coletores", "type": "list", "permission": false,
      "depends": [{"path":"/api/collectors", "method": "GET"},
        {"path":"/api/groups", "method": "GET"}]},
    "add-collectors" : {"description": "Adicionar Coletor", "group": "Coletores", "type": "add", "permission": false,
      "depends": [{"path":"/api/collectors", "method": "GET"},
        {"path":"/api/collectors", "method": "POST"},
        {"path":"/api/groups", "method": "GET"}]},
    "edit-collectors" : {"description": "Editar Coletor", "group": "Coletores", "type": "edit", "permission": false,
      "depends": [{"path":"/api/collectors", "method": "GET"},
        {"path":"/api/collectors", "method": "PUT"},
        {"path":"/api/groups", "method": "GET"}]},
    "remove-collectors" : {"description": "Remover Coletor", "group": "Coletores", "type": "remove", "permission": false,
      "depends": [{"path":"/api/collectors", "method": "GET"},
        {"path":"/api/collectors", "method": "PUT"},
        {"path":"/api/groups", "method": "GET"},
        {"path":"/api/collectors", "method": "DELETE"}]},
    "menu-rfiddata" : {"description": "Menu de RfidData", "group": "RfidData", "type": "list", "permission": false,
      "depends": [{"path":"/api/rfiddatas", "method": "GET"},
        {"path":"/api/collectors", "method": "GET"},
        {"path":"/api/groups", "method": "GET"},
        {"path":"/api/dynamic", "method": "GET"}]},
    "menu-importfile" : {"description": "Menu de Importação", "group": "Importação", "type": "add", "permission": false,
      "depends": [{"path":"/api/import", "method": "POST"}]}
    };

    var userRoles = angular.fromJson(localStorage.getItem('flexUser')).routes;
    // var deferred = $q.defer();

    angular.forEach(userRoles, function(userRole){

      if((userRole.path === '/api/dynamic' && userRole.method === 'GET') || (userRole.path === 'ANY' && userRole.method === 'ANY')){
        var dynamicService = Restangular.service('dynamic');

        dynamicService.getList().then(function(response){
          angular.forEach(response.plain(), function(entity){
            roles["menu-"+entity.identifier] = {"description": "Menu de "+entity.field, "group": entity.field, "type": "list", "permission": false, "depends": [
                   {"path": "/api/dao/"+entity.identifier, "method": "GET"},{"path":"/api/dynamic", "method": "GET"}]};
            roles["add-"+entity.identifier] = {"description": "Menu de "+entity.field, "group": entity.field, "type": "add", "permission": false, "depends": [
                   {"path": "/api/dao/"+entity.identifier, "method": "POST"},{"path": "/api/dao/"+entity.identifier, "method": "GET"},{"path":"/api/dynamic", "method": "GET"}]};
            roles["edit-"+entity.identifier] = {"description": "Menu de "+entity.field, "group": entity.field, "type": "edit", "permission": false, "depends": [
                 {"path": "/api/dao/"+entity.identifier, "method": "PUT"},{"path": "/api/dao/"+entity.identifier, "method": "GET"},{"path":"/api/dynamic", "method": "GET"}]};
            roles["remove-"+entity.identifier] = {"description": "Menu de "+entity.field, "group": entity.field, "type": "remove", "permission": false, "depends": [
                  {"path": "/api/dao/"+entity.identifier, "method": "DELETE"},{"path": "/api/dao/"+entity.identifier, "method": "GET"},{"path":"/api/dynamic", "method": "GET"}]};
          });
          // deferred.resolve(roles);
        });
      }
    });

    // return deferred.promise;
    return roles;
});
