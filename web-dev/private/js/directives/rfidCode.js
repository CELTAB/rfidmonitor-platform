/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.directive('rfidCode', function() {
  return {
    require: 'ngModel',
    scope: {
      target: '=rfidCode',
      source: '=ngModel'
    },
    link: function (scope, elem, attrs, ngModel) {
      scope.$watch('source', function() {
        if(scope.source){
          if(attrs.name === 'hexa'){
            scope.target = parseInt(scope.source, 16);
          }else if(attrs.name === 'decimal'){
            scope.target = parseInt(scope.source).toString(16);
          }
        }else{
           scope.target = "";
        }
      });
    }
  };
});
