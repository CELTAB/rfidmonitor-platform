/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('usersCtrl', function($rootScope, $scope, Restangular, singleFilter){

	var usersService = Restangular.service('users');

  	$scope.usersScopeProvider = {
  		details: function(row){
  			$rootScope.openModal('user', 'view/modal/userModalDetail.html', 'Detalhes Usuário', Restangular.copy(row.entity), null, usersService, null, loadUsers, null);
  		}
  	};

	$scope.usersGridOptions = {
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
	    appScopeProvider: $scope.usersScopeProvider,
	    rowTemplate: 'view/templates/template-dblclick.html'
	 };

	$scope.usersGridOptions.columnDefs = [
	      { name: 'name', displayName: 'Nome'},
	      { name: 'username', displayName: 'Usuário'},
	      { name: 'email', displayName: 'E-mail'},
	];

	var loadUsers = function(){
		usersService.getList().then(function(response){
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
