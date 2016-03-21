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

		// {	name: 'serverReceivedDate',
		// 	sort: { direction: 'desc', priority: 0 },
		// 	cellFilter:'date:"dd/MM/yyyy - HH:mm:ss"',
		// 	type:'date',
		// 	displayName: 'Recebimento' },

		var defaultRfidGrid =  [
				{ name: 'rfidCode', displayName: 'Código'},
				{ name: 'rfidReadDate', cellFilter:'date:"dd/MM/yyyy - HH:mm:ss"', type:'date', displayName: 'Leitura'},
				{ name: 'Collector.name', displayName: 'Coletor'}
		];

		$scope.rfiddataGridOptions.columnDefs = angular.copy(defaultRfidGrid);

	collectorService.getList().then(function(response){
		$scope.collectors = response.plain();
	});

	groupsService.getList().then(function(response){
		$scope.groups = response.plain();
	});

	$scope.getEntityStructure = function(){
		$scope.search.entityQuery = undefined;
		if($scope.search.entity !== ""){
				$scope.search.entityQuery = {include : [{all : true}]};
				$scope.entityStructure = angular.copy($rootScope.metaDynamics[$scope.search.entity]);
				$scope.entityOptions = {};
				angular.forEach($scope.entityStructure.structureList, function(structure){
						if(structure.type === 'ENTITY'){
							var service = Restangular.service('de/dao/'+structure.name);
							var query = {q:{attributes : ["id",structure.defaultReference]}};
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
	// $scope.search.entity = "";
	// $scope.search.entityQuery = {include : [{all : true}]};

	$scope.buscar = function(){
		// https://localhost:8143/api/rfiddatas?q={"where":{"rfidCode":{"$ilike":"8%25"}}, "limit":"200", "attributes":["rfidCode"], "group":["rfidCode"]}
		// q={"where":{"rfidCode":{"$ilike":"8917143"},"collectorId":"5"}, "include":[{"all":true}]}
		// https://localhost:8143/api/rfiddata?q={"where":{"rfidcode":"44332222","collectorId":1"}}
		// q={"where":{"id":{"$lt":10}},"limit":4}
		// {q: {"include":[{"all":true}]}}
		// q={"where":{"rfidCode":{"$in":["9236658","1836774"]}}}

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

		// @TODO arrumar data quando so tem inicio ou so tem fim, ou somente um dia
		if($scope.search.fromDate !== "" && $scope.search.toDate !== ""){
			$scope.search.toDate.setHours(23);
			$scope.search.toDate.setMinutes(59);
			$scope.search.toDate.setSeconds(59);
			query.q.where.rfidReadDate = {};
			query.q.where.rfidReadDate.$between = [angular.copy($scope.search.fromDate), angular.copy($scope.search.toDate)];
		}

		if($scope.search.fromDate !== ""){
			var now = new Date();
			$scope.search.toDate = now;
			query.q.where.rfidReadDate = {};
			query.q.where.rfidReadDate.$between = [angular.copy($scope.search.fromDate), angular.copy($scope.search.toDate)];
		}

		if($scope.search.entity !== ""){
			query.q.entity = angular.copy($scope.search.entity);
		}else{
			$scope.search.entity = undefined;
		}

		if(angular.isDefined($scope.search.entityQuery) && $scope.search.entityQuery !== ""){
			if(angular.isDefined($scope.search.entityQuery.where)){
				angular.forEach($scope.search.entityQuery.where, function(value, key){
					if(value === "" || value === null){
						$scope.search.entityQuery.where[key] = undefined;
					}
				});
			}
			query.q.entityQuery = angular.copy($scope.search.entityQuery);
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
			$scope.rfiddataGridOptions.data = response.plain();
		}, function(response){
			$scope.errorMessage = response;
		});

	};

	$scope.limpar = function(){

	};

});
