/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('dynamicCtrl', function($rootScope, $scope, $routeParams, Restangular, fileUpload, singleFilter){

	$scope.dynamicEntity = $rootScope.metaDynamics[$routeParams.dynamicUrl];
	$scope.dynamicEntities = {};

	var dynamicService = Restangular.service('de/dao/'+$scope.dynamicEntity.identifier);
	var groupsService = Restangular.service('groups');

	$scope.loadding = false;
	var paginationOptions = {
		pageNumber: 1,
		pageSize: 20,
	};

	$scope.dynamicScopeProvider = {
		details: function(row){
			$rootScope.openModal('dynamic', 'view/modal/dynamicModalDetail.html', 'Detalhes '+$scope.dynamicEntity.field, Restangular.copy(row.entity), $scope.groups, dynamicService, $scope.dynamicEntity.structureList, loadDynamics, $scope.dynamicEntities);
		}
	};

	$scope.dynamicGridOptions = {
	    paginationPageSizes: [20, 50, 100],
    	paginationPageSize: 20,
			useExternalPagination: true,
    	minRowsToShow: 21,
	    multiSelect: false,
	    enableRowSelection: true,
	    enableSelectAll: false,
	    enableRowHeaderSelection: false,
	    selectionRowHeaderWidth: 35,
	    onRegisterApi: function(gridApi){
	      $scope.gridApi = gridApi;
				$scope.gridApi.grid.registerRowsProcessor( singleFilter.filter, 200 );
				gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
					paginationOptions.pageNumber = newPage;
					paginationOptions.pageSize = pageSize;
					loadDynamics();
				});
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
				$scope.dynamicGridOptions.columnDefs.push(
					{ name: value.identifier+'_hexa', displayName: value.field+' HEXA' }
				);
				filterOptions.push(value.identifier);
				filterOptions.push(value.identifier+'_hexa');
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
		var query = {};
		query.q = {};
		query.q.include = [{"all":true}];
		query.q.limit = paginationOptions.pageSize;
		query.q.offset = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;

		$scope.loadding = true;
		dynamicService.getList(query).then(function(response){
				angular.forEach(response, function(row){
					angular.forEach($scope.dynamicEntity.structureList, function(structure){
						if(structure.type === 'RFIDCODE'){
							row[structure.identifier+'_hexa'] = parseInt(row[structure.identifier]).toString(16);
						}
						if(structure.type === "DATETIME"){
							row[structure.identifier] = row[structure.identifier] ? new Date(row[structure.identifier]) : undefined;
						}
					});
				});
				$scope.loadding = false;
				$scope.dynamicGridOptions.totalItems = response.count;
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
