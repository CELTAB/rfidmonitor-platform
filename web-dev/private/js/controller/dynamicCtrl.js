/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('dynamicCtrl', function($rootScope, $scope, $routeParams, Restangular, fileUpload, singleFilter){

	$scope.dynamicEntity = $rootScope.metaDynamics[$routeParams.dynamicUrl];
	$scope.dynamicEntities = {};

	var dynamicService = Restangular.service('de/dao/'+$scope.dynamicEntity.identifier);
	var groupsService = Restangular.service('groups');

	$scope.dynamicScopeProvider = {
		details: function(row){
			$rootScope.openModal('dynamic', 'view/modal/dynamicModalDetail.html', 'Detalhes '+$scope.dynamicEntity.field, Restangular.copy(row.entity), $scope.groups, dynamicService, $scope.dynamicEntity.structureList, loadDynamics, $scope.dynamicEntities);
		}
	};

	$scope.dynamicGridOptions = {
	    paginationPageSizes: [20, 50, 100],
    	paginationPageSize: 20,
    	minRowsToShow: 21,
	    multiSelect: false,
	    enableRowSelection: true,
	    enableSelectAll: false,
	    enableRowHeaderSelection: false,
	    selectionRowHeaderWidth: 35,
	    onRegisterApi: function(gridApi){
	      $scope.gridApi = gridApi;
				$scope.gridApi.grid.registerRowsProcessor( singleFilter.filter, 200 );
	    },
	    appScopeProvider: $scope.dynamicScopeProvider,
	    rowTemplate: 'view/templates/template-dblclick.html'
	 };

	$scope.dynamicGridOptions.columnDefs = [];

	var filterOptions = [];

	angular.forEach($scope.dynamicEntity.structureList, function(value){
		switch(value.type) {
	    case 'TEXT':
        $scope.dynamicGridOptions.columnDefs.push(
					{ name: value.identifier, displayName: value.field }
				);
				filterOptions.push(value.identifier);
        break;
	    case 'INTEGER':
      	$scope.dynamicGridOptions.columnDefs.push(
					{ name: value.identifier, displayName: value.field }
				);
				filterOptions.push(value.identifier);
        break;
	    case 'DOUBLE':
      	$scope.dynamicGridOptions.columnDefs.push(
					{ name: value.identifier, displayName: value.field }
				);
				filterOptions.push(value.identifier);
        break;
	    case 'RFIDCODE':
	      $scope.dynamicGridOptions.columnDefs.push(
					{ name: value.identifier, displayName: value.field }
				);
				filterOptions.push(value.identifier);
	      break;
	    case 'DATETIME':
		    $scope.dynamicGridOptions.columnDefs.push(
					{ name: value.identifier,
						cellFilter:'date:"dd/MM/yyyy - HH:mm:ss"',
    			  type:'date',
					  displayName: value.field
					}
				);
        break;
 	    case 'GROUP':
				$scope.dynamicGridOptions.columnDefs.push(
					{ name: value.name+'.name',
						displayName: value.field
					}
				);
				filterOptions.push(value.name);
				filterOptions.push('name');
	      groupsService.getList().then(function(response){
					$scope.groups = response;
				});
      	break;
	    case 'ENTITY':
	      $scope.dynamicGridOptions.columnDefs.push(
					{ name: value.name+'.'+value.defaultReference,
					  displayName: value.field
					}
				);
				filterOptions.push(value.name);
				filterOptions.push(value.defaultReference);
        break;
		}

	});

	$scope.newDynamic = function(){
		$rootScope.openModal($scope.dynamicEntity.identifier, 'view/modal/dynamicModalForm.html', $scope.dynamicEntity.field, {}, $scope.groups, dynamicService, $scope.dynamicEntity.structureList, loadDynamics, $scope.dynamicEntities);
	};


	var loadDynamics = function(){
		dynamicService.getList({q: {"include":[{"all":true}]}}).then(function(response){
  			$scope.dynamicGridOptions.data = response;
		});
	};

	var laodDynamicEntities = function(){
		if(Object.keys($scope.dynamicEntities).length === 0){
			angular.forEach($scope.dynamicEntity.structureList, function(value){
				if(value.type == 'ENTITY'){
					Restangular.all('de/dao/'+value.name).getList().then(function(response) {
					  	$scope.dynamicEntities[value.name] = response;
					});
				}
			});
		}
	};

	$scope.filter = function(){
		singleFilter.values($scope.filterValue, filterOptions);
		$scope.gridApi.grid.refresh();
	};

	loadDynamics();
	laodDynamicEntities();

});
