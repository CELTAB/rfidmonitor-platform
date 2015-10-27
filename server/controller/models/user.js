'use strict';
var sequelize = require(__base + 'controller/database/platformsequelize');
var Controller = require(__base + 'controller/basemodelctrl');

var UserModel = sequelize.model('User');
var UserCtrl = new Controller(UserModel, 'users');
module.exports = UserCtrl;
