/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('dashboardCtrl', function($scope, Restangular){

	var collectorsService = Restangular.service('collectors');
	var rfiddataService = Restangular.service('rfiddatas');

	$scope.labelsChartCollector = [];
	$scope.dataChartCollector = [];
	$scope.labelsRfid = [];
	$scope.dataRfid = [];
	$scope.seriesRfid = [];

  $scope.getCollectors = function(){
		collectorsService.getList({q: {"dashboard": true}}).then(function(response){
			response.sort(function sortById(a,b){ return a.id - b.id; });
		 	$scope.collectors = response;

			if($scope.collectors.length){
				angular.forEach($scope.collectors, function(collector){
					$scope.seriesRfid.push(collector.name);
					$scope.dataChartCollector.push(collector.records.total);

					var lastYear = collector.records.lastYear;
					var last = [];
					for(attr in lastYear){
						last.push(lastYear[attr]);
					}
					$scope.dataRfid.push(last);
				});
				for(attr in $scope.collectors[0].records.lastYear){
					$scope.labelsRfid.push(attr);
				}
			}
  	});
  };

	$scope.getCollectors();

});
