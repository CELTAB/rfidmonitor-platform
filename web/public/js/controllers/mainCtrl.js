angular.module("rfidplatform").controller('mainCtrl', function ($scope, $rootScope, $location, loginService, UserService, $cookies) {
    
    var cookiesUser = $cookies.getAll();
    if(cookiesUser.user){
      var usuario = angular.fromJson(cookiesUser.user);
      UserService.setCurrentUser(usuario);
    }

    $scope.currentUser = UserService.getCurrentUser();

    var revoke = function(){
      $cookies.remove('user');
      $scope.currentUser = UserService.setCurrentUser(null);
    }

    $scope.logout = function() {

      loginService.logout()
        .success(
          function(data){
            revoke();
            $location.path('/login');
          })
        .error(
          function(data){
            revoke();
          });
    }

    $scope.login = function(){
      $location.path('/login');
    }

    $scope.goToClients = function(){
      $location.path('/clients');
    }

    $scope.goToRfiddata = function(){
      $location.path('/noAccess');
    }

    $rootScope.$on('authorized', function() {
       $scope.currentUser = UserService.getCurrentUser();
    });

    $rootScope.$on('unauthorized', function() {
        revoke();
        $location.path('/login');
    });

    $rootScope.$on('forbidden', function(){
      $location.path('/noAccess');
    });

    if(!$scope.currentUser){
      $location.path('/login');
    }else{
      $location.path('/home');
    }
});