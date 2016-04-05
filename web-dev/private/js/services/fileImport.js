/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.factory('fileImport', function ($http, Restangular) {
  var _import = function(file){
    var fd = new FormData();
    fd.append('rfidimport', file);
    return Restangular.all('import').post(fd, {}, {'Content-Type': undefined});
  };
  return {
    import: _import
  };
});
