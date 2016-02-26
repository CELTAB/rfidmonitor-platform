'use strict';
var sequelize = require(__base + 'controller/database/platformsequelize');
var Controller = require(__base + 'controller/basemodelctrl');

var AccessModel = sequelize.model('RouteAccess');
var AccessCtrl = new Controller(AccessModel, 'routeaccess');
module.exports = AccessCtrl;
