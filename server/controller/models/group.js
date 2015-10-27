var logger = require('winston');
var sequelize = require(__base + 'controller/database/platformsequelize');
var Controller = require(__base + 'controller/basemodelctrl');

var GroupModel = sequelize.model('Group');
var Group = new Controller(GroupModel, 'groups');

//To add customs functions, do as the follow example
//Adding a custom function for save
// Group.custom['save'] = function(body, callback){

// 	console.log("My custom function for save");
// 	callback(null, "My custem funciont answered");
// };

module.exports = Group;
