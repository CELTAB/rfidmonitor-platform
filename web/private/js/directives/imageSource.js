/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.directive('imageSource', function (Restangular) {
	return {
		link: function (scope, iElement, iAttrs) {
			Restangular.one('media', 1).get().then(function(response){
				var b64 = btoa(unescape(encodeURIComponent(atob('data:image/jpeg;base64,'+response))));
				iAttrs.$set('src', b64);
			});
		}
	};
});
