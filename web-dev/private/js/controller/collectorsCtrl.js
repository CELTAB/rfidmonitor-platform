/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('collectorsCtrl', function($scope, Restangular, singleFilter, mapCenter){

	var collectorsService = Restangular.service('collectors');
	var groupsService = Restangular.service('groups');
	$scope.loadding = false;
	var paginationOptions = {
		pageNumber: 1,
		pageSize: 5,
	};

	$scope.collectorsScopeProvider = {
		details: function(row){
			 $scope.openModal('collector', 'view/modal/collectorModalDetail.html', 'Detalhes Coletor', Restangular.copy(row.entity), $scope.groups, collectorsService, null, loadCollectors);
		}
	};

	$scope.collectorsGridOptions = {
	    paginationPageSizes: [5, 10, 25],
    	paginationPageSize: 5,
			useExternalPagination: true,
	    multiSelect: false,
	    enableRowSelection: true,
	    enableSelectAll: false,
	    enableRowHeaderSelection: false,
	    selectionRowHeaderWidth: 35,
	    minRowsToShow: 6,
	    onRegisterApi: function(gridApi){
	      $scope.gridApi = gridApi;
	      $scope.gridApi.grid.registerRowsProcessor( singleFilter.filter, 200 );
				gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
					paginationOptions.pageNumber = newPage;
					paginationOptions.pageSize = pageSize;
					loadCollectors();
				});
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
		var query = {};
		query.q = {};
		query.q.include = [{"all":true}];
		query.q.limit = paginationOptions.pageSize;
		query.q.offset = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;

		$scope.loadding = true;
		collectorsService.getList(query).then(function(response){
			$scope.loadding = false;
			$scope.collectorsGridOptions.totalItems = response.count;
			$scope.collectorsGridOptions.data = response;

			var _markers = [];
			angular.forEach(response, function(collector){
				var _marker = {};
    		_marker.id = collector.id;
    		_marker.coords = {};
    		_marker.coords.latitude = collector.lat;
    		_marker.coords.longitude = collector.lng;
    		_marker.window = {};
    		_marker.window.title = collector.name;
				_markers.push( _marker );
			});

			$scope.markers = _markers;
		});
	};

	var loadGroups = function(){
		groupsService.getList().then(function(response){
			 $scope.groups = response.plain();
		});
	};

	loadCollectors();
	loadGroups();

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
