'use strict';
var sequelize = require(__base + 'controller/database/platformsequelize');
var Controller = require(__base + 'controller/basemodelctrl');

var RoutesModel = sequelize.model('UriRoute');
var RoutesCtrl = new Controller(RoutesModel, 'routes');

var changeFunc = function(body, callback){
  var errMessage = {error: "Not Allowed", code: 403, message: "You are not allowed to make any change on UriRoutes"};
	callback(errMessage);
};

RoutesCtrl.custom['remove'] = changeFunc;
RoutesCtrl.custom['save'] = changeFunc;
module.exports = RoutesCtrl;
