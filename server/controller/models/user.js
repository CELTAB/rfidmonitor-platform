'use strict';
var sequelize = require(__base + 'controller/database/platformsequelize');
var Controller = require(__base + 'controller/basemodelctrl');
var errorHandler = require(__base + 'utils/errorhandler');

var UserModel = sequelize.model('User');
var UserCtrl = new Controller(UserModel, 'users');

UserCtrl.custom['save'] = function(body, callback){
  if(body.id || body._id)
    return UserCtrl.save(body, callback);

  UserCtrl.save(body, function(err, user){
    if(err)
      return callback(err);

    var AppClient = sequelize.model('AppClient');
    var app = {description: 'Default appClient for ' + user.username, userId: user.id};
    AppClient.create(app).then(function(appCreated){
      user = user.clean();
      user.appClient = appCreated;
      return callback(null, user);
    }).catch(function(e){
      return errorHandler('Error on create appClient: ' + e.toString(), 500, callback);
    });
  });
};

module.exports = UserCtrl;
