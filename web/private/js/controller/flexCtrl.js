/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('flexCtrl', function($rootScope, $scope, $http, $uibModal, $log, $location, Restangular){

  $scope.user = angular.fromJson(localStorage.getItem('flexUser'));

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

	/////////////////////////////////////////////////////////
  	// Meta Dynamic Entiteis
  	/////////////////////////////////////////////////////////

  	var metaService = Restangular.service('de/meta');

  	$rootScope.loadMetaDynamics = function(){
  		metaService.getList().then(function(response){
	  		$rootScope.metaDynamics = {};
	  		angular.forEach(response, function(entity){
	  			$rootScope.metaDynamics[entity.identifier] = entity;
	  		});
		  });
  	};

  	$rootScope.loadMetaDynamics();

	/////////////////////////////////////////////////////////
  	// rootScope Modal
  	/////////////////////////////////////////////////////////

    $rootScope.openModal = function(type, size, template, title, entity, groups, service, structureList, loadDataTableGrid, dynamicEntities, users){

		$uibModal.open({
			animation: true,
			templateUrl: template,
			size: size,
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

	/////////////////////////////////////////////////////////
  	// Dashboard @TODO
  	/////////////////////////////////////////////////////////

	// ChartJS Example
	$scope.labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];
	$scope.series = ['Nov/2014', 'Nov/2015'];
	$scope.data = [
		[65, 59, 80, 81, 56, 55, 40, 28, 48, 40, 19, 86, 27, 90, 81, 56, 55, 40, 28, 48, 40, 19, 28, 48, 40, 19, 86, 27, 90, 81],
		[28, 48, 40, 19, 86, 27, 90, 40, 19, 86, 27, 90, 81, 56, 55, 40, 28, 48, 40, 19, 28, 14, 12, 10, 18, 60, 80, 33, 14, 70]
	];

	$scope.labelsChartRfid = [ 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez' ];
	$scope.dataChartRfid = [
		[10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 90, 80],
		[28, 48, 40, 19, 86, 27, 90, 40, 19, 86, 27, 90]
	];

	$scope.labelsChartCollector = ['ABC', 'DFG', 'XYZ', 'HIJ', 'ZZZ'];
	$scope.dataChartCollector = [1200, 400, 800, 200, 100];

	$scope.onClick = function (points, evt) {
		console.log(points, evt);
	};

});
