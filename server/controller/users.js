var sequelize = require(__base + 'controller/platformsequelize');

var UserController = require(__base + 'controller/basemodelctrl');

var UserModel = sequelize.model('User');

var UserCtrl = new UserController(UserModel, 'User');

UserCtrl.custom['find'] = function(a, body, callback){

	callback(null, "Função customizada!!");
};

UserCtrl.custom['remove'] = function(body, callback){

	callback(null, "Função customizada!!");
};

module.exports = UserCtrl;

