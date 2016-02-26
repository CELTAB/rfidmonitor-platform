'use strict';
var logger = require('winston');
var sequelize = require(__base + 'controller/database/platformsequelize');
var Controller = require(__base + 'controller/basemodelctrl');

var AppClientModel = sequelize.model('AppClient');
var AppClientCtrl = new Controller(AppClientModel, 'appclients');
//Any custom functions goes here
module.exports = AppClientCtrl;
