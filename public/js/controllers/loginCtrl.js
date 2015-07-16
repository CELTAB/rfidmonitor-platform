angular.module("rfidplatform").controller("loginCtrl", function($scope, $window, loginService, $location, apiHeader, $rootScope){
  
  $scope.tittle = "Tela de Login";

  $scope.tryLogin = function(login){

      var suc = function(data){
        if(data){
          console.log(JSON.stringify(data));
          var token = data.token;

          apiHeader.init(token);
          $rootScope.token = token;
          $location.path('/home');
        }
      };

      var error = function(data){
        $scope.error = data.error;
        $window.history.back();
      };

      loginService.login(login).success(suc).error(error);
  };
});