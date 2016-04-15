/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('dashboardCtrl', function($rootScope, $scope, Restangular){

	var collectorsService = Restangular.service('collectors');

	$scope.labelsChartCollector = [];
	$scope.dataChartCollector = [];
	$scope.labelsRfid = [];
	$scope.dataRfid = [];
	$scope.seriesRfid = [];
	$scope.loadding = false;

	if($rootScope.checkRoles('menu-dashboard')){
		var getCollectors = function(){
			$scope.loadding = true;
			collectorsService.getList({q: {"dashboard": true}}).then(function(response){
				response.sort(function sortById(a,b){ return a.id - b.id; });

				if(response.length){
					angular.forEach(response, function(collector){
						$scope.seriesRfid.push(collector.name);
						$scope.dataChartCollector.push(collector.records.total);

						var lastYear = collector.records.lastYear;
						var last = [];
						for(var attr in lastYear){
							last.push(lastYear[attr]);
						}
						$scope.dataRfid.push(last);
					});
					for(var attr in response[0].records.lastYear){
						$scope.labelsRfid.push(attr);
					}
					$scope.collectors = response;
					$scope.loadding = false;
				}
			});
		};

		getCollectors();
	}

});
