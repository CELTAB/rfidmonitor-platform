/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('rfiddataCtrl', function($rootScope, $scope, $q, Restangular){

	var rfiddataService = Restangular.service('rfiddatas');
	var collectorService = Restangular.service('collectors');
	var groupsService = Restangular.service('groups');

	$scope.rfidEntities = [];

	angular.forEach($rootScope.metaDynamics, function(value){
		value.structureList.some(function(structure){
			if(structure.type === 'RFIDCODE'){
				var entity = {field: value.field, identifier: value.identifier};
				$scope.rfidEntities.push(entity);
				return true;
			}
		});
	});

	$scope.rfiddataGridOptions = {
			paginationPageSizes: [5, 10, 25, 50, 100],
			paginationPageSize: 25,
			minRowsToShow: 25,
			enableGridMenu: true,
			enableSelectAll: true,
			exporterCsvFilename: 'myFile.csv',
			exporterPdfDefaultStyle: {fontSize: 9},
			exporterPdfTableStyle: {margin: [20, 20, 20, 20]},
			exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
			exporterPdfHeader: { text: "Relatório", style: 'headerStyle' },
			exporterPdfFooter: function ( currentPage, pageCount ) {
				return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
			},
			exporterPdfCustomFormatter: function ( docDefinition ) {
				docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
				docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
				return docDefinition;
			},
			exporterPdfOrientation: 'landscape',
			exporterPdfPageSize: 'A4',
			exporterPdfMaxGridWidth: 500,
			exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
			onRegisterApi: function(gridApi){
				$scope.gridApi = gridApi;
			}
		};

		var defaultRfidGrid =  [
				{ name: 'rfidCode', displayName: 'Código'},
				{ name: 'rfidReadDate', cellFilter:'date:"dd/MM/yyyy - HH:mm:ss"', type:'date', displayName: 'Leitura'},
				{ name: 'Collector.name', displayName: 'Coletor'}
		];

		$scope.rfiddataGridOptions.columnDefs = angular.copy(defaultRfidGrid);

	var entityIdentifierDate = [];

	collectorService.getList().then(function(response){
		$scope.collectors = response.plain();
	});

	groupsService.getList().then(function(response){
		$scope.groups = response.plain();
	});

	$scope.getEntityStructure = function(){
		entityIdentifierDate = [];
		$scope.search.entityQuery = undefined;
		if($scope.search.entity !== ""){
				$scope.search.entityQuery = {include : [{all : true}]};
				$scope.entityStructure = angular.copy($rootScope.metaDynamics[$scope.search.entity]);
				$scope.entityOptions = {};
				angular.forEach($scope.entityStructure.structureList, function(structure){
						if(structure.type === 'DATETIME'){
							entityIdentifierDate.push(structure.name);
						}
						if(structure.type === 'ENTITY'){
							var service = Restangular.service('de/dao/'+structure.name);
							var query = {q: {attributes : ["id", structure.defaultReference]}};
							service.getList(query).then(function(response){
									$scope.entityOptions[structure.name] = response.plain();
							});
						}
				});
		}else{
			$scope.search.entity = undefined;
			$scope.search.entityQuery = undefined;
			$scope.entityStructure = undefined;
		}
	};

	$scope.loadRfiddataCode = function(like) {

		var query = {};
		query.q = {};
		query.q.where = {};
		query.q.where.rfidCode = {};
		query.q.where.rfidCode.$ilike = like + "%";
		query.q.limit = "5";
		query.q.attributes = ["rfidCode"];
		query.q.group = ["rfidCode"];

		var deferred = $q.defer();

		rfiddataService.getList(query).then(function(response){
			var rfids = response.plain().map(function(code){
				return code.rfidCode;
			});
			deferred.resolve(rfids);
		});

		return deferred.promise;
	};

	$scope.search = {};
	$scope.search.rfidCodes = [];
	$scope.search.collectorId = "";
	$scope.search.fromDate = "";
	$scope.search.toDate = "";

	$scope.buscar = function(){

		var rfids = $scope.search.rfidCodes.map(function(code){
			return code.text;
		});

		var query = {};
		query.q = {};
		query.q.include = [{"all":true}];
		query.q.where = {};

		if($scope.search.collectorId !== ""){
				query.q.where.collectorId = angular.copy($scope.search.collectorId);
		}
		if(rfids.length){
			query.q.where.rfidCode = {};
			query.q.where.rfidCode.$in = rfids;
		}

		if(($scope.search.fromDate !== "" && $scope.search.fromDate !== null) && ($scope.search.toDate !== "" && $scope.search.toDate !== null)){
			$scope.search.toDate.setHours(23);
			$scope.search.toDate.setMinutes(59);
			$scope.search.toDate.setSeconds(59);
			query.q.where.rfidReadDate = {};
			query.q.where.rfidReadDate.$between = [angular.copy($scope.search.fromDate), angular.copy($scope.search.toDate)];
		}

		if(($scope.search.fromDate === "" || $scope.search.fromDate === null) && $scope.search.toDate !== ""){
			$scope.search.fromDate = new Date(0);
			query.q.where.rfidReadDate = {};
			query.q.where.rfidReadDate.$between = [angular.copy($scope.search.fromDate), angular.copy($scope.search.toDate)];
		}

		if($scope.search.fromDate !== "" && ($scope.search.toDate === "" || $scope.search.toDate === null)){
			$scope.search.toDate = new Date();
			query.q.where.rfidReadDate = {};
			query.q.where.rfidReadDate.$between = [angular.copy($scope.search.fromDate), angular.copy($scope.search.toDate)];
		}

		if($scope.search.entity !== ""){
			query.q.entity = angular.copy($scope.search.entity);
		}else{
			$scope.search.entity = undefined;
		}

		query.q.entityQuery = angular.copy($scope.search.entityQuery);

		if(angular.isDefined(query.q.entityQuery) && query.q.entityQuery !== ""){
			if(angular.isDefined(query.q.entityQuery.where)){
				angular.forEach(query.q.entityQuery.where, function(value, key){
					if(entityIdentifierDate.indexOf(key) > -1){
						query.q.entityQuery.where[key].$between = [query.q.entityQuery.where[key].from, query.q.entityQuery.where[key].to];
						delete query.q.entityQuery.where[key].from;
						delete query.q.entityQuery.where[key].to;
					}
					if(value === "" || value === null){
						query.q.entityQuery.where[key] = undefined;
					}
				});
			}
		}else{
			$scope.search.entityQuery = undefined;
		}

		rfiddataService.getList(query).then(function(response){
			$scope.rfiddataGridOptions.columnDefs = angular.copy(defaultRfidGrid);
			if(angular.isDefined(query.q.entity)){
				angular.forEach($scope.entityStructure.structureList, function(value){
					if(value.type === "TEXT"){
							$scope.rfiddataGridOptions.columnDefs.push({ name: 'entity.'+value.name, displayName: value.field});
					}
					if(value.type === "DOUBLE"){
							$scope.rfiddataGridOptions.columnDefs.push({ name: 'entity.'+value.name, displayName: value.field});
					}
					if(value.type === "DATETIME"){
							$scope.rfiddataGridOptions.columnDefs.push({ name: 'entity.'+value.name, cellFilter:'date:"dd/MM/yyyy - HH:mm:ss"', type:'date', displayName: value.field});
					}
					if(value.type === "ENTITY"){
							$scope.rfiddataGridOptions.columnDefs.push({ name: 'entity.'+value.name+'.'+value.defaultReference, displayName: value.field});
					}
					if(value.type === "GROUP"){
							$scope.rfiddataGridOptions.columnDefs.push({ name: 'entity.Group.name', displayName: value.field});
					}
				});
			}

			// @TODO pagination for rfidCode
			if($scope.hexa){
				$scope.rfiddataGridOptions.columnDefs.push({ name: 'rfidCode_hexa', displayName: 'Código Hexa'});
				$scope.rfiddataGridOptions.data = [];
				angular.forEach(response.plain(), function(row){
					row.rfidCode_hexa = parseInt(row.rfidCode).toString(16);
					$scope.rfiddataGridOptions.data.push(row);
				});
			}else{
				 $scope.rfiddataGridOptions.data = response.plain();
			}

		}, function(response){
			$scope.errorMessage = response;
		});

	};

	$scope.limpar = function(){

	};

});
