/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('flexCtrl', function($rootScope, $scope, $http, $location, $uibModal, Restangular, checkRoles){

  $scope.user = angular.fromJson(localStorage.getItem('flexUser'));

  $rootScope.checkRoles = checkRoles;

  $rootScope.isActive = function(viewLocation) {
    return viewLocation === $location.path();
  };

  $rootScope.go = function(path) {
	  $location.path(path);
	};

  $scope.logout = function(user){
    $http.post(window.location.origin + '/logout').success(function(data){
      localStorage.removeItem('flexUser');
      window.location = window.location.origin;
    }).error(function(data){
      $scope.errorMessage = data.message;
    });
  };

  if(!$scope.user){
    $scope.logout();
  }

  if($rootScope.checkRoles('menu-dynamic')){
    var dynamicService = Restangular.service('dynamic');

  	$rootScope.loadMetaDynamics = function(){
  		dynamicService.getList().then(function(response){
    		$rootScope.metaDynamics = {};
    		angular.forEach(response, function(entity){
    			$rootScope.metaDynamics[entity.identifier] = entity;
    		});
  	  });
  	};
  	$rootScope.loadMetaDynamics();
  }

  $rootScope.openModal = function(type, template, title, entity, groups, service, structureList, loadDataTableGrid, dynamicEntities, users){
		$uibModal.open({
			animation: true,
			templateUrl: template,
			controller: 'modalCtrl',
			resolve: {
				type: function(){
					return type;
				},
      	title: function(){
      		return title;
      	},
				entity: function(){
					return entity;
				},
				groups: function(){
					return groups;
				},
				service: function(){
					return service;
				},
				structureList: function(){
					return structureList;
				},
				loadDataTableGrid: function(){
					return loadDataTableGrid;
				},
				dynamicEntities: function(){
					return dynamicEntities;
				},
        users: function(){
          return users;
        }
   		}
		});
	};

});
