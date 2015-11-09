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

UserCtrl.login = function(candidateUser, callback){
  try{
      var User = sequelize.model("User");
      User.scope('loginScope').findOne({where: {username: candidateUser.username}})
      .then(function(user){
        if(!user || !user.isPasswordValid(candidateUser.password))
          return errorHandler('Invalid username or password', 400, callback);

        var AppClient = sequelize.model('AppClient');
        AppClient.find({where: {userId: user.id}}).then(function(app){
          if(!app)
            return errorHandler('Token not found for user ' + user.username, 400, callback);

          user.token = app.token;
          return callback(null, user.clean());
        });
      });
  }catch(e){
    return errorHandler('Internal Error: ' + e.toString(), 500, callback);
  }
};

module.exports = UserCtrl;
