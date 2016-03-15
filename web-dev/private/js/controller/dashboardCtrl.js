/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('dashboardCtrl', function($scope, Restangular){

	var collectorsService = Restangular.service('collectors');


  $scope.getCollectors = function(){
    collectorsService.getList().then(function(response){
  		 $scope.collectors = response;
  	});
  }

	$scope.getCollectors();

	$scope.labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];
	$scope.series = ['Nov/2014', 'Nov/2015', 'Nov/2014', 'Nov/2015'];
	$scope.data = [
	  [65, 59, 80, 81, 56, 55, 40, 28, 48, 40, 19, 86, 27, 90, 81, 56, 55, 40, 28, 48, 40, 19, 28, 48, 40, 19, 86, 27, 90, 81],
	  [28, 48, 40, 19, 86, 27, 90, 40, 19, 86, 27, 90, 81, 56, 55, 40, 28, 48, 40, 19, 28, 14, 12, 10, 18, 60, 80, 33, 14, 70],
	  [48, 40, 19, 28, 48, 40, 19, 86, 27, 90, 81, 48, 40, 19, 86, 27, 90, 81, 56, 55, 40, 28, 65, 59, 80, 81, 56, 55, 40, 28],
	  [86, 27, 90, 81, 56, 55, 40, 28, 48, 40, 19, 86, 27, 90, 81, 56, 55, 40, 28, 48, 28, 48, 40, 19, 86, 27, 90, 40, 19, 70]
	];

	$scope.labelsChartRfid = [ 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez' ];
	$scope.dataChartRfid = [
	  [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 90, 80],
	  [28, 48, 40, 19, 86, 27, 90, 40, 19, 86, 27, 90]
	];

	$scope.labelsChartCollector = ['ABC', 'DFG', 'XYZ', 'HIJ', 'ZZZ'];
	$scope.dataChartCollector = [1200, 400, 800, 200, 100];

	$scope.onClick = function (points, evt) {
	  console.log(points, evt);
	};

});
