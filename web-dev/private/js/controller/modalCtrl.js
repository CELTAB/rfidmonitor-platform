/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('modalCtrl', function($rootScope, $scope, $uibModalInstance, Restangular, type, title, entity, groups, service, structureList, loadDataTableGrid, dynamicEntities, users, fileUpload, apiInfo) {

	$scope.modalTitle = title;
	$scope.modalType = type;
	$scope.entity = entity;
	$scope.groups = groups;
	$scope.structureList = structureList;
	$scope.dynamicEntities = dynamicEntities;
	$scope.users = users;
	$scope.apiInfo = apiInfo;

	$scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.remove = function(entity){
  	entity.remove().then(function(){
			$uibModalInstance.close();
			loadDataTableGrid();
  	}, function(response) {
	  	console.log("Error with status code", response.status);
	  	$scope.errorMessage = response.data;
		});
  };

  $scope.save = function(entity){
  	_checkFiles(entity);
	};

	$scope.removeFromDetail = function(entity){
		$uibModalInstance.dismiss();
		$rootScope.openModal(type, 'view/modal/modalDelete.html', 'Excluir '+title, Restangular.copy(entity), $scope.groups, service, structureList, loadDataTableGrid, dynamicEntities, users);
	};

	$scope.editFromDetail = function(entity){
		$uibModalInstance.dismiss();
  	$rootScope.openModal(type, 'view/modal/'+type+'ModalForm.html', 'Editar '+title, Restangular.copy(entity), $scope.groups, service, structureList, loadDataTableGrid, dynamicEntities, users);
  };

  $scope.active = function(identifier){
    service.customPUT({}, identifier).then(function() {
    	$uibModalInstance.dismiss();
		  loadDataTableGrid();
		  $rootScope.loadMetaDynamics();
		});
	};

	var _isUndefinedOrNull = function(val) {
		return angular.isUndefined(val) || val === null;
	};

	var _checkFiles = function(entity){

		var filesCount = 0;
		var filesTotal = 0;
		var filesMap = {};

		for (var prop in entity){
  		if(entity[prop] instanceof File){
  			filesTotal++;
  			filesMap[prop] = entity[prop];
  		}
  	}

		var _upload = function(entity, _prop){
			if(entity[_prop] instanceof File){
				fileUpload.uploadFile(entity[_prop])
				.then(function(response){
					filesCount++;
					entity[_prop] = response.mediaId;
					if(filesCount === filesTotal){
						_saveEntity(entity);
					}
				}, function(response){
					// @TODO enviar para view o erro
					console.log(response);
				});
			}
		};

  	if(filesTotal !== 0){
			for (var _prop in entity){
				_upload(entity, _prop);
	  	}
  	}else{
  		_saveEntity(entity);
  	}

	};


	var _saveEntity = function(entity){

  	if ( _isUndefinedOrNull(entity.id) ){
			service.post(entity).then(function(response){
				$uibModalInstance.dismiss();
				loadDataTableGrid();
	  	}, function(response) {
			  console.log("Error with status code", response.status);
			  $scope.errorMessage = response.data;
			});
		} else {
			entity.put().then(function(response){
				$uibModalInstance.dismiss();
				loadDataTableGrid();
	  	}, function(response) {
			  console.log("Error with status code", response.status);
			  $scope.errorMessage = response.data;
			});
		}

	};

});
