/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('importfileCtrl', function($scope, fileImport){

  $scope.importfile = function(){
    fileImport.import($scope.importModel).then(function(response){
          $scope.clear();
          $scope.successMessage = response;
    }, function(response){
          $scope.clear();
          $scope.errorMessage = response.data;
    });
  };

  $scope.clear = function(){
    $scope.errorMessage = false;
    $scope.successMessage = false;
    $scope.importModel = null;
    angular.element("input[type='file']").val(null);
  };

});
