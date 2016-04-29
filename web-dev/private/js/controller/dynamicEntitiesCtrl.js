/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('dynamicEntitiesCtrl', function($rootScope, $scope, Restangular, singleFilter){

  var dynamicService = Restangular.all('dynamic');

  $scope.loadding = false;
  var paginationOptions = {
    pageNumber: 1,
    pageSize: 20,
  };

  $scope.dynamicEntitiesScopeProvider = {
    details: function(row){
      $rootScope.openModal('dynamicEntities', 'view/modal/dynamicEntitiesModalDetail.html', 'Detalhes Entidade Dinamica', Restangular.copy(row.entity), null, dynamicService, null, loadDynamicEntities, null);
    }
  };

  $scope.dynamicEntitiesGridOptions = {
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
					loadDynamicEntities();
				});
      },
      appScopeProvider: $scope.dynamicEntitiesScopeProvider,
      rowTemplate: 'view/templates/template-dblclick.html'
   };

  $scope.dynamicEntitiesGridOptions.columnDefs = [
        { name: 'field', displayName: 'Entidade', width: '30%'  },
        { name: 'description', displayName: 'Descrição'},
        { name: 'active', cellTemplate: 'view/templates/template-ative-cell.html', width: '10%'  }

  ];

  var loadDynamicEntities = function(){
    var query = {};
    query.q = {};
    query.q.limit = paginationOptions.pageSize;
    query.q.offset = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
    query.q.original = true;

    $scope.loadding = true;
    dynamicService.getList(query).then(function(response){
       $scope.loadding = false;
       $scope.dynamicEntitiesGridOptions.totalItems = response.count;
       $scope.dynamicEntitiesGridOptions.data = response;
    });
  };

  loadDynamicEntities();

  $scope.filter = function(){
    singleFilter.values($scope.filterValue, ['field', 'description']);
    $scope.gridApi.grid.refresh();
  };

});
