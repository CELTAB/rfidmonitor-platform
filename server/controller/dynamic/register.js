'use strict';
var sequelize = require(__base + 'controller/database/platformsequelize');
var Controller = require(__base + 'controller/basemodelctrl');

var DeCtrl = {name: 'de/register', custom: {}, customRoute:[]};
DeCtrl.isValid = function(){return true};

// This function can be placed inside utils
var notAllowedMethod = function(){
  var errMessage = 'Interaction with de/register is Not Allowed. Only for save';
  var response = {code: 403, message: errMessage, error: 'Not Allowed'};
  return {
    update: function(){
      return function(a, callback){
        return callback(response);
      }
    },
    find: function(){
      return function(a, b, callback){
        return callback(response);
      }
    }
  };
}();

DeCtrl.custom['find'] = notAllowedMethod.find();
DeCtrl.custom['update'] = notAllowedMethod.update();
DeCtrl.custom['remove'] = notAllowedMethod.update();
DeCtrl.custom['save'] = function(body, callback){
  var dynamicEntities = new (require(__base + 'controller/dynamic/dynamicentities'))();
  dynamicEntities.registerEntity(body, function(errors){
    if(errors)
      return callback({code: 500, error: 'errors : ' + JSON.stringify(errors), message: 'Error on save dynamic entity'});
    return callback(null, {"message" : "OK"});
  });
};

module.exports = DeCtrl;
