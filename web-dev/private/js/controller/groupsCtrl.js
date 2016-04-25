/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('groupsCtrl', function($rootScope, $scope, Restangular, singleFilter, uiGridConstants){

	var groupsService = Restangular.service('groups');

	$scope.loadding = false;
	var paginationOptions = {
		pageNumber: 1,
		pageSize: 20,
	};

	$scope.groupsScopeProvider = {
		details: function(row){
			$rootScope.openModal('group', 'view/modal/groupModalDetail.html', 'Detalhes Grupo', Restangular.copy(row.entity), null, groupsService, null, loadGroups, null);
		}
	};

	$scope.groupsGridOptions = {
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
					loadGroups();
				});
	    },
	    appScopeProvider: $scope.groupsScopeProvider,
	    rowTemplate: 'view/templates/template-dblclick.html'
	 };

	$scope.groupsGridOptions.columnDefs = [
	      { name: 'name', displayName: 'Nome'},
	      { name: 'description', displayName: 'Descrição'},
	      { name: 'createdAt', cellFilter:'date:"dd/MM/yyyy - HH:mm:ss"', type:'date', displayName: 'Criação'},
	      { name: 'isDefault', displayName: 'Padrão', cellTemplate: 'view/templates/template-default-cell.html' }
	];

	var loadGroups = function(){
		var query = {};
		query.q = {};
		query.q.limit = paginationOptions.pageSize;
		query.q.offset = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;

		$scope.loadding = true;
		groupsService.getList(query).then(function(response){
			 $scope.loadding = false;
			 $scope.groupsGridOptions.totalItems = response.count;
			 $scope.groupsGridOptions.data = response;
		});
	};

	loadGroups();

	$scope.newGroup = function(){
       $rootScope.openModal('group', 'view/modal/groupModalForm.html', 'Novo Grupo', {}, null, groupsService, null, loadGroups, null);
    };

  $scope.filter = function(){
  	singleFilter.values($scope.filterValue, ['name', 'description']);
  	$scope.gridApi.grid.refresh();
  };

});
