/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('appClientsCtrl', function($rootScope, $scope, Restangular, singleFilter){

	var appClientsService = Restangular.service('appclients');
	var usersService = Restangular.service('users');

	$scope.loadding = false;
	var paginationOptions = {
		pageNumber: 1,
		pageSize: 20,
	};

	var loadUsers = function(){
		usersService.getList().then(function(response){
			 $scope.users = response.plain();
		});
	};

	loadUsers();

	$scope.appClientsScopeProvider = {
		details: function(row){
			$rootScope.openModal('appClients', 'view/modal/appClientsModalDetail.html', 'Detalhes AppClients', Restangular.copy(row.entity), null, appClientsService, null, loadAppClients, null, $scope.users);
		}
	};

	$scope.appClientsGridOptions = {
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
					loadAppClients();
				});
	    },
	    appScopeProvider: $scope.appClientsScopeProvider,
	    rowTemplate: 'view/templates/template-dblclick.html'
	 };

	$scope.appClientsGridOptions.columnDefs = [
        { name: 'User.name', displayName: 'Usuário'},
        { name: 'description', displayName: 'Descrição'},
	      { name: 'token', displayName: 'Token'},
	      { name: 'createdAt', cellFilter:'date:"dd/MM/yyyy - HH:mm:ss"', type:'date', displayName: 'Criação'}
	];

	var loadAppClients = function(){
		var query = {};
		query.q = {};
		query.q.include = [{"all":true}];
		query.q.limit = paginationOptions.pageSize;
		query.q.offset = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;

		$scope.loadding = true;
		appClientsService.getList(query).then(function(response){
			 $scope.loadding = false;
			 $scope.appClientsGridOptions.totalItems = response.count;
			 $scope.appClientsGridOptions.data = response;
		});
	};

	loadAppClients();

	$scope.newAppClients = function(){
       $rootScope.openModal('appClients', 'view/modal/appClientsModalForm.html', 'Novo AppClients', {}, null, appClientsService, null, loadAppClients, null, $scope.users);
    };

  $scope.filter = function(){
  	singleFilter.values($scope.filterValue, ['name', 'description','User']);
  	$scope.gridApi.grid.refresh();
  };

});
