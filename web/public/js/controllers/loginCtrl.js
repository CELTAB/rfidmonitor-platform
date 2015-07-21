angular.module("rfidplatform").controller("loginCtrl", function($scope, $window, loginService, $location, $rootScope, UserService, $cookies){
  
  $scope.tittle = "Tela de Login";

  $scope.tryLogin = function(login){

      var suc = function(data, status, header, config){
        if(data){

          console.log("HEADERS: " + header('Set-Cookie'));

          console.log(JSON.stringify(data));
          var token = data.token;

          login.token = data.token;

          console.log("Ali ó" + JSON.stringify(login));
          $cookies.put('user', login);
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