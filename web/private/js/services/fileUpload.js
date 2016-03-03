/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.factory('fileUpload', function ($http, Restangular) {
  var _uploadFile = function(file){
    var fd = new FormData();
    fd.append('image', file);
    return Restangular.all('media').post(fd, {}, {'Content-Type': undefined});
  }
  return {
    uploadFile: _uploadFile
  };
});
