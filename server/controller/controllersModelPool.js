'use strict';
var logger = require('winston');
var sequelize = require(__base + 'controller/database/platformsequelize');
var Controller = require(__base + 'controller/basemodelctrl');

/*
Class that is responsible for manage a pool of controllers for all models.
Is possible to register each controller individualy for any models,
or create default controllers for all modules defined in sequelize.
*/

//Poll of controllers
var controllers = [];
var Controllers = function(){
  //Create default controller based on baseModelCtrl class
  var createController = function(modelName){
    return new Controller(sequelize.model(modelName), modelName.toLowerCase() + 's');
  };

  //Return a controller by its name
  this.get = function(modelName){
    return controllers[modelName];
  };

  //Return all controllers created
  this.getAll = function(){
    return controllers;
  };

  /*
  Receives a controller to atach in the pool. Need to bo instance of baseModelCtrl.
  Possible to use {force: true} parameter to avoid the needed of bean a baseModelCtrl instance,
  but in this case the controller needs to have a name property and the methos properties (find, save, remove).
  Or the customs methods (custom['find'], custom['save'], custom['remove'])
  */
  this.register = function(controller, force){
    if((force && force.force === true) || (controller.isValid && controller.isValid() === true)){
      controllers[controller.name] = controller;
    }else {
      throw new Error("Controller needs to be an instance of basemodelctrl");
    }
  };

  //Create and load controllers for all models in sequelize
  this.loadControllers = function(){
    var models = sequelize.models;
    for(var key in models){
      if(!controllers[key])
        controllers[key] = createController(key);
    }
  };
}

module.exports = Controllers;
