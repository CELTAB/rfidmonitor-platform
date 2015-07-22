angular.module("rfidplatform").service('UserService', function($rootScope, $http) {
    var service = this,
        currentUser = null;

    service.setCurrentUser = function(user) {
        currentUser = user;
        if(user){
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
            console.log("Setting access token to: " + user.token);
            
            delete currentUser.password;

        }else{
            delete $http.defaults.headers.common['Authorization'];
            console.log("Removing access token!");
        }

        return currentUser;
    };

    service.getCurrentUser = function() {
        return currentUser;
    };
})