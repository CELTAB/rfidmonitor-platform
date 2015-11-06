'use strict';
var logger = require('winston');
var sequelize = require(__base + 'controller/database/platformsequelize');
var Controller = require(__base + 'controller/basemodelctrl');
var errorHandler = require(__base + 'utils/errorhandler');

var GroupModel = sequelize.model('Group');
var Group = new Controller(GroupModel, 'groups');

Group.custom['save'] = function(body, callback){
  var save = function(){
    return Group.save(body, callback);
  }
  try{
    GroupModel.findOne({where: {isDefault: true}})
    .then(function(group){
      if(!group){
        body.isDefault = true;
        return save();
      }
      if(body.id === group.id){
        body.isDefault = true;
        return save();
      }else{
        if(body.isDefault !== true)
          return save();
        group.isDefault = null;
        group.save().then(save);
      }
    });
  }catch(e){
    return errorHandler(e.toString(), 500, callback);
  }
};

Group.custom['remove'] = function(id, callback){
  Group.find(id, null, function(err, group){
    if(err)
      return callback(err);
    if(!group)
      return errorHandler('Group not found', 400, callback);
    if(group.isDefault)
      return errorHandler('Not allowed to delete default group', 400, callback);
    Group.remove(id, callback);
  });
};

module.exports = Group;
