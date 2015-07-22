angular.module("rfidplatform").controller("loginCtrl", function($scope, loginService, $location, $rootScope, UserService, $cookies){
  
  $scope.tittle = "Login";

  $scope.tryLogin = function(login){

      var suc = function(data, status, header, config){
        if(data){

          login.token = data.token;
          login.email = data.email;

          delete login.password;

          UserService.setCurrentUser(login);

          $cookies.put('user', JSON.stringify(login));

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