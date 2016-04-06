/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp',
	['ngRoute',
	'ngTouch',
	'ngAnimate',
	'restangular',
	'chart.js',
	'uiGmapgoogle-maps',
	'toggle-switch',
	'ngTagsInput',
	'ui.bootstrap',
	'ui.bootstrap.datetimepicker',
	'ui.grid',
	'ui.grid.pagination',
	'ui.grid.saveState',
	'ui.grid.selection',
	'ui.grid.cellNav',
	'ui.grid.resizeColumns',
	'ui.grid.moveColumns',
	'ui.grid.pinning',
	'ui.grid.autoResize',
	'ui.grid.exporter']);

app.constant('apiInfo', {	baseUrl: window.location.origin + '/api' });
app.constant('mapCenter', { lat: -25.428006, lng: -54.584640 });

app.config(function($routeProvider, $locationProvider, RestangularProvider, apiInfo) {

	RestangularProvider.setBaseUrl(apiInfo.baseUrl);

	if(localStorage.getItem('flexUser')){
		RestangularProvider.setDefaultHeaders({'Authorization' : 'Bearer '+angular.fromJson(localStorage.getItem('flexUser')).token });
	}

	$routeProvider
		.when('/', {
			redirectTo: function () {
        return "/dashboard";
      }
		})
		.when('/dashboard', {
			templateUrl: 'view/dashboard.html',
			controller: 'dashboardCtrl'
		})
		.when('/users', {
			templateUrl: 'view/users.html',
			controller: 'usersCtrl'
		})
		.when('/routeAccess', {
			templateUrl: 'view/routeAccess.html',
			controller: 'routeAccessCtrl'
		})
		.when('/appClients', {
			templateUrl: 'view/appClients.html',
			controller: 'appClientsCtrl'
		})
		.when('/dynamicEntities', {
			templateUrl: 'view/dynamicEntities.html',
			controller: 'dynamicEntitiesCtrl'
		})
		.when('/dynamicEntity-add', {
			templateUrl: 'view/dynamicEntity-add.html',
			controller: 'dynamicEntityAddCtrl'
		})
		.when('/groups', {
			templateUrl: 'view/groups.html',
			controller: 'groupsCtrl'
		})
		.when('/collectors', {
			templateUrl: 'view/collectors.html',
			controller: 'collectorsCtrl'
		})
		.when('/rfiddata', {
			templateUrl: 'view/rfiddata.html',
			controller: 'rfiddataCtrl'
		})
		.when('/importfile', {
			templateUrl: 'view/importfile.html',
			controller: 'importfileCtrl'
		})
		.when('/:dynamicUrl', {
			templateUrl: 'view/dynamic.html',
			controller: 'dynamicCtrl'
		})
		.otherwise({
			redirctTo: '/'
		});

});
