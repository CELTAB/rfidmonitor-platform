angular.module("rfidplatform").controller('mainCtrl', function ($scope, $rootScope, $location, loginService, UserService) {
    $scope.currentUser = UserService.getCurrentUser();

    $scope.logout = function() {
      $scope.currentUser = UserService.setCurrentUser(null);
      $location.path('/login');
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
        $location.path('/login');
    });

    $rootScope.$on('forbidden', function(){
      $location.path('/noAccess');
    });

    if(!$scope.currentUser){
      $location.path('/login');
    }
});