/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('dashboardCtrl', function($rootScope, $scope, $interval, $filter, Restangular){

	var dashboardService = Restangular.service('dashboard');

	$scope.dataChartCollector = [];
	$scope.labelsRfid = [];
	$scope.dataRfid = [];
	$scope.seriesRfid = [];
	$scope.optionsRfid = {animation : false};
	$scope.dashboardRealTime = false;
	var intervalTimer = null;
	var firstTime = true;

	$scope.$on('$routeChangeStart', function(next, current) {
	 $scope.dashboardRealTime = false;
	 $scope.checkDashboard();
	});

	$scope.checkDashboard = function(){
		if($scope.dashboardRealTime){
			intervalTimer = $interval(function () {
				 getDashboard();
			}, 10000);
		}else{
			$interval.cancel(intervalTimer);
		}
	};

	if($rootScope.checkRoles('list-dashboard')){
		var getDashboard = function(){
			$scope.labelsRfid = [];

			dashboardService.getList().then(function(response){
				response.sort(function sortById(a,b){ return a.id - b.id; });

				if(response.length){
					angular.forEach(response, function(collector, key){
						var lastYear = collector.records.lastYear;
						var last = [];
						for(var attr in lastYear){
							last.push(lastYear[attr]);
						}
						$scope.seriesRfid[key] = $filter('limitTo')(collector.name, 30);
						$scope.dataChartCollector[key] = collector.records.total;
						$scope.dataRfid[key] = last;
					});
					for(var attr in response[0].records.lastYear){
						$scope.labelsRfid.push(attr);
					}
					$scope.collectors = response;
				}
			});
		};

		getDashboard();
	}

});
