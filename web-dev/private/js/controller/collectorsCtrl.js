/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('collectorsCtrl', function($scope, Restangular, singleFilter, mapCenter){

	var collectorsService = Restangular.service('collectors');
	var groupsService = Restangular.service('groups');

	groupsService.getList().then(function(response){
		 $scope.groups = response;
	});

	$scope.collectorsScopeProvider = {
		details: function(row){
			 $scope.openModal('collector', 'view/modal/collectorModalDetail.html', 'Detalhes Coletor', Restangular.copy(row.entity), $scope.groups, collectorsService, null, loadCollectors);
		}
	};

	$scope.collectorsGridOptions = {
	    paginationPageSizes: [5, 10, 25, 50, 100],
    	paginationPageSize: 5,
	    multiSelect: false,
	    enableRowSelection: true,
	    enableSelectAll: false,
	    enableRowHeaderSelection: false,
	    selectionRowHeaderWidth: 35,
	    minRowsToShow: 6,
	    onRegisterApi: function(gridApi){
	      $scope.gridApi = gridApi;
	      $scope.gridApi.grid.registerRowsProcessor( singleFilter.filter, 200 );
	    },
	    appScopeProvider: $scope.collectorsScopeProvider,
	    rowTemplate: 'view/templates/template-dblclick.html'
	 };

	$scope.collectorsGridOptions.columnDefs = [
	      { name: 'name', displayName: 'Nome'},
	      { name: 'description', displayName: 'Descrição'},
	      { name: 'Group.name', displayName: 'Grupo'},
	      { name: 'mac', displayName: 'MAC'},
	      { name: 'lat' },
	      { name: 'lng' },
	      { name: 'status', cellTemplate: 'view/templates/template-status-cell.html' }
	];

	var loadCollectors = function(){
		collectorsService.getList({q: {"include":[{"all":true}]}}).then(function(response){
			$scope.collectorsGridOptions.data = response;

			$scope.markers = [];

			angular.forEach(response, function(collector){
				var _marker = {};
    		_marker.id = collector.id;
    		_marker.coords = {};
    		_marker.coords.latitude = collector.lat;
    		_marker.coords.longitude = collector.lng;
    		_marker.window = {};
    		_marker.window.title = collector.name;

				$scope.markers.push( _marker );
			});
		});
	};

	loadCollectors();

	$scope.newCollector = function(){
		$scope.openModal('collector', 'view/modal/collectorModalForm.html', 'Novo Coletor', {}, $scope.groups, collectorsService, null, loadCollectors);
	};

 	$scope.filter = function(){
    	singleFilter.values($scope.filterValue, ['name', 'description', 'Group', 'status']);
    	$scope.gridApi.grid.refresh();
    };

	$scope.map = {
		center: { latitude: mapCenter.lat, longitude: mapCenter.lng },
		zoom: 14
	};

	$scope.map.options = { MapTypeId: google.maps.MapTypeId.HYBRID };

});
