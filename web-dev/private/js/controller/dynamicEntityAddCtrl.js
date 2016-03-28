/**
** @author Mohamad Abu Ali <mohamad@abuali.com.br>
*/
var app = angular.module('flexApp');
app.controller('dynamicEntityAddCtrl', function($rootScope, $scope, Restangular){

    var registerService = Restangular.service('de/register');

  	$scope.entity = {};
    $scope.lastId = 0;
    $scope.formsFields = [ ];

  	$scope.fields = [
  		{type : "TEXT", name : "Texto"},
  		{type : "DATETIME", name : "Data"},
  		{type : "INTEGER", name : "Número Inteiro"},
      {type : "DOUBLE", name : "Número Decimal"},
  		{type : "GROUP", name : "Grupo"},
  		{type : "RFIDCODE", name : "Código Rfid"},
  		{type : "IMAGE", name : "Imagem"}
  	];

    $scope.addFirstEntity = function(){
      if($scope.formsFields.length){
        $scope.formsFields.push({formId: ++$scope.lastId, field: '', type: 'ENTITY', description: '', unique: [], defaultReference: '', structureList: []});
      }else{
        $scope.lastId = 0;
        $scope.formsFields.push({formId: $scope.lastId, field: '', type: 'ENTITY', description: '', unique: [], defaultReference: '', structureList: []});
      }
    };

    $scope.addFirstEntity();

    $scope.addEntity = function(formId){
      _dynamicFields(formId, $scope.formsFields, 'addEntity');
    };

    $scope.addInput = function(formId){
      _dynamicFields(formId, $scope.formsFields, 'addInput');
    };

    $scope.removeField = function(formId){
      _dynamicFields(formId, $scope.formsFields, 'remove');
    };

    $scope.saveFields = function(){
      _checkUnique($scope.formsFields, null);

      registerService.post($scope.formsFields).then(function(response){
        $rootScope.loadMetaDynamics();
        $rootScope.go('/dynamicEntities');
        $scope.formsFields = [];
        }, function(response) {
          $scope.errorMessage = response.data;
      });
    };

    var _dynamicFields = function(formId, array, action){
      angular.forEach(array, function(value, key){
        if(value.formId === formId && action === 'addEntity'){
          value.structureList.push({formId:  ++$scope.lastId, field: '', type: 'ENTITY', description: '', unique: [], defaultReference: '', structureList: []});
          return;
        }else if(value.formId === formId && action === 'addInput'){
          value.structureList.push({formId:  ++$scope.lastId, field: '', type: '', description: '', allowNull: false, unique: false});
          return;
        }else if(value.formId === formId && action === 'remove'){
          array.splice(key, 1);
          return;
        }

        if(value.type === 'ENTITY'){
          _dynamicFields(formId, value.structureList, action);
        }
      });
    };

    var _checkUnique = function(formsFields, entity){
      angular.forEach(formsFields, function(field){
        if(field.type === 'ENTITY'){
          _checkUnique(field.structureList,field);
        }else{
          if(field.unique){
            entity.unique.push([field.field]);
          }
        }
      });
    };

});
