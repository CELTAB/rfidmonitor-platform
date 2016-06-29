/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('dependsCtrl', function($scope, $uibModalInstance, title, depends, dependsMe) {

  $scope.modalTitle = title;
	$scope.depends = depends;
	$scope.dependsMe = dependsMe;

	$scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  };

});
