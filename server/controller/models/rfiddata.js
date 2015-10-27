'use strict';
var logger = require('winston');
var sequelize = require(__base + 'controller/database/platformsequelize');
var BaseController = require(__base + 'controller/basemodelctrl');

var RfidModel = sequelize.model('Rfiddata');
var Rfid = new BaseController(RfidModel, 'rfiddatas');

var changeFunc = function(body, callback){
  var errMessage = {error: "Not Allowed", code: 403, message: "You are not allowed to make any change on rfidDatas"};
	callback(errMessage);
};

Rfid.custom['remove'] = changeFunc;
Rfid.custom['save'] = changeFunc;
module.exports = Rfid;
