'use strict';
var logger = require('winston');
var sequelize = require(__base + 'controller/database/platformsequelize');
var Controller = require(__base + 'controller/basemodelctrl');

var AppClientModel = sequelize.model('AppClient');
var AppClientCtrl = new Controller(AppClientModel, 'appclients');
//Any custom functions goes here
//
// AppClientCtrl.custom['save'] = function(body, callback){
//   if(body._id || body.id){
//     return AppClientCtrl.save(body, callback);
//   }else{
//     return callback({code: 400, error: 'Not Allowed', message: 'You are not allowed to create an AppClient'});
//   }
// }

module.exports = AppClientCtrl;
