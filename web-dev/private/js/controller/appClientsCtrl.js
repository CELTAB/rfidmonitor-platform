/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('appClientsCtrl', function($rootScope, $scope, Restangular, singleFilter){

	var appClientsService = Restangular.service('appclients');
	var usersService = Restangular.service('users');

	var loadUsers = function(){
		usersService.getList().then(function(response){
			 $scope.users = response;
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
		appClientsService.getList({q: {"include":[{"all":true}]}}).then(function(response){
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
