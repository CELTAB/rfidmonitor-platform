/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('dynamicEntitiesCtrl', function($rootScope, $scope, Restangular, singleFilter){

  var originalService = Restangular.service('de/original');
  var activateOne = Restangular.one('de/activate');
  var deactivateOne = Restangular.one('de/deactivate');

  $scope.filterValue = "";

  $scope.dynamicEntitiesScopeProvider = {
    details: function(row){
      var service = row.entity.active ? deactivateOne : activateOne;
      $rootScope.openModal('dynamicEntities', 'view/modal/dynamicEntitiesModalDetail.html', 'Detalhes Entidade Dinamica', Restangular.copy(row.entity), null, service, null, loadDynamicEntities, null);
    }
  };

  $scope.dynamicEntitiesGridOptions = {
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
      appScopeProvider: $scope.dynamicEntitiesScopeProvider,
      rowTemplate: 'view/templates/template-dblclick.html'
   };

  $scope.dynamicEntitiesGridOptions.columnDefs = [
        { name: 'field', displayName: 'Entidade', width: '30%'  },
        { name: 'description', displayName: 'Descrição'},
        { name: 'active', cellTemplate: 'view/templates/template-ative-cell.html', width: '10%'  }

  ];

  var loadDynamicEntities = function(){
    originalService.getList().then(function(response){
       $scope.dynamicEntitiesGridOptions.data = response;
    });
  };

  loadDynamicEntities();

  $scope.filter = function(){
    singleFilter.values($scope.filterValue, ['field', 'description']);
    $scope.gridApi.grid.refresh();
  };

});
