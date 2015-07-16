angular.module("rfidplatform").factory('httpInterceptor', function httpInterceptor ($q, $window, $location, $rootScope) {
  return {
    responseError: function(rejection){
      /*
        Interceptor for http. On every response from the server this function will be executed to verify if the response status is 401 (Unauthorized).
        If the response came with an Unauthorized code the user will se an message telling the he doesn't have acces permission for the resource/path he's trying to access.
      */
      if (rejection.status === 401) {
        console.log("Status 401");
        $rootScope.$broadcast('unauthorized');
        //Redirect the user fot the /noAccess message.
      }else if(rejection.status === 403){
        console.log("Status 403");
        $rootScope.$broadcast('forbidden');
      }
      return( $q.reject( rejection ) );
    },
    request: function(config){
      console.log(config);
     
     return config;
    }
  }
});