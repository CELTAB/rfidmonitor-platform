/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('usersCtrl', function($rootScope, $scope, Restangular, singleFilter){

	var usersService = Restangular.service('users');
	$scope.loadding = false;
	var paginationOptions = {
		pageNumber: 1,
		pageSize: 20,
	};

	$scope.usersScopeProvider = {
		details: function(row){
			$rootScope.openModal('user', 'view/modal/userModalDetail.html', 'Detalhes Usuário', Restangular.copy(row.entity), null, usersService, null, loadUsers, null);
		}
	};

	$scope.usersGridOptions = {
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
					loadUsers();
				});
	    },
	    appScopeProvider: $scope.usersScopeProvider,
	    rowTemplate: 'view/templates/template-dblclick.html'
	 };

	$scope.usersGridOptions.columnDefs = [
	      { name: 'name', displayName: 'Nome'},
	      { name: 'username', displayName: 'Usuário'},
	      { name: 'email', displayName: 'E-mail'},
	];

	var loadUsers = function(){
		var query = {};
		query.q = {};
		query.q.limit = paginationOptions.pageSize;
		query.q.offset = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;

		$scope.loadding = true;
		usersService.getList(query).then(function(response){
			 $scope.loadding = false;
			 $scope.usersGridOptions.totalItems = response.count;
			 $scope.usersGridOptions.data = response;
		});
	};

	loadUsers();

	$scope.newUser = function(){
       $rootScope.openModal('user', 'view/modal/userModalForm.html', 'Novo Usuário', {}, null, usersService, null, loadUsers, null);
    };

  $scope.filter = function(){
  	singleFilter.values($scope.filterValue, ['name', 'description', 'email']);
  	$scope.gridApi.grid.refresh();
  };

});
