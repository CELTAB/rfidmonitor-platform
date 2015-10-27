'use strict';
var logger = require('winston');
var sequelize = require(__base + 'controller/database/platformsequelize');
var Controller = require(__base + 'controller/basemodelctrl');

var CollectorModel = sequelize.model('Collector');
var CollectorCtrl = new Controller(CollectorModel, 'collectors');
//Any custom functions goes here

module.exports = CollectorCtrl;
