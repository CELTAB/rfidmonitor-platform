var logger = require('winston');

var sequelize = require(__base + 'controller/platformsequelize');

var CollectorController = require(__base + 'controller/basemodelctrl');

var CollectorModel = sequelize.model('Collector');

var CollectorCtrl = new CollectorController(CollectorModel, 'Collector');

module.exports = CollectorCtrl;