angular.module("rfidplatform").controller("loginCtrl", function($scope, $window, loginService, $location, $rootScope, UserService){
  
  $scope.tittle = "Tela de Login";

  $scope.tryLogin = function(login){

      var suc = function(data){
        if(data){
          console.log(JSON.stringify(data));
          var token = data.token;

          login.token = data.token;
          UserService.setCurrentUser(login);

          $rootScope.$broadcast('authorized');
          $location.path('/home');
        }
      };

      var error = function(data){
        $scope.login.username = '';
        $scope.login.password = '';
        $scope.loginForm.$setPristine();
        $scope.error = data.error;
      };

      loginService.login(login).success(suc).error(error);
  };
});