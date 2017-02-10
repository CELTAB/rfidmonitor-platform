/****************************************************************************
**
** Copyright (C) 2015
**                     Gustavo Valiati <gustavovaliati@gmail.com>
**                     Thiago R. M. Bitencourt <thiago.mbitencourt@gmail.com>
**
** This file is part of the FishMonitoring project
**
** This program is free software; you can redistribute it and/or
** modify it under the terms of the GNU General Public License
** as published by the Free Software Foundation; version 2
** of the License.
**
** This program is distributed in the hope that it will be useful,
** but WITHOUT ANY WARRANTY; without even the implied warranty of
** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
** GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License
** along with this program; if not, write to the Free Software
** Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
**
****************************************************************************/

'use strict';
var logger = require('winston');
var sequelize = require(__base + 'controller/database/platformsequelize');
var Controller = require(__base + 'controller/basemodelctrl');

/**
 * Holds the poll of controllers
 * @type {Array}
 * @memberof Controllers
 */
var controllers = [];

/**
 * Class that is responsible for managing a pool of controllers for every model.
 * Is possible to register each controller individualy for any model,
 * or create default controllers for all modules defined in sequelize.
 * @class
 */
var Controllers = function(){
  /**
   * Create a default controller based on BaseModelController class
   * @param  {String} modelName the model's name registered on Sequelize.
   * @return {BaseModelController}           a default controller for the given model.
   */
  var createController = function(modelName){
    return new Controller(sequelize.model(modelName), modelName.toLowerCase() + 's');
  };

  /**
   * Returns a controller by its name
   * @param  {String} modelName the model's name registered on Sequelize.
   * @return {BaseModelController}           the controller present in the pool.
   */
  this.get = function(modelName){
    return controllers[modelName];
  };

  /**
   * Return all controllers created present in the pool
   * @return {Array} the list of controllers.
   */
  this.getAll = function(){
    return controllers;
  };

  /*

  */

 /**
  * Receives a controller to insert in the pool. Need to be an instance of BaseModelController.
  * It is possible to use the option {force: true} as parameter, to avoid the need of being a BaseModelController instance,
  * but in this case the controller needs to have a name property and the methods properties (find, save, remove).
  * Or the customs methods (custom['find'], custom['save'], custom['remove'])
  * @param  {Object} controller a BaseModelController instance, or a object that implement its functions.
  * @param  {Object} force      option object: {force: true}
  * @return {void}
  * @see BaseModelController
  */
  this.register = function(controller, force){
    if((force && force.force === true) || (controller.isValid && controller.isValid() === true)){
      controllers[controller.name] = controller;
    }else {
      throw new Error("Controller needs to be an instance of basemodelctrl");
    }
  };

  /**
   * Create and load controllers for every model in sequelize
   * @return {void}
   */
  this.loadControllers = function(){
    var models = sequelize.models;
    for(var key in models){
      if(!controllers[key])
        controllers[key] = createController(key);
    }
  };
}

module.exports = Controllers;
