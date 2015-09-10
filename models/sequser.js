var logger = require('winston');
var SequelizeClass = require('sequelize');
var sequelize = require('../dao/platformsequelize');
var Hash = require('../utils/baseutils').Hash;

module.exports = sequelize.define("User", {
	name : {
		type : SequelizeClass.STRING,
		allowNull : false
	},
	email: {
		type : SequelizeClass.STRING,
		allowNull : false,
		validate: {
			isEmail: true
		}
	},
	username: {
		type : SequelizeClass.STRING,
		allowNull : false,
		unique : true		
	},
	password: {
		type: SequelizeClass.STRING,
		allowNull: false,
		set: function(pass){
			this.setDataValue('password', Hash.createHash(pass));
		}
	},
	loginAllowed: {
		type: SequelizeClass.BOOLEAN,
		defaultValue: false
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_user',
	defaultScope: 
		{
			attributes : ['id', 'name', 'username', 'email', 'loginAllowed'],
			where: { deletedAt: null }
		},
	instanceMethods: {
    	clean: function()  { 
    		var objUser = {};
    		objUser.id = this.getDataValue('id');
    		objUser.name = this.getDataValue('name');
    		objUser.email = this.getDataValue('email');
    		objUser.username = this.getDataValue('username');
    		objUser.loginAllowed = this.getDataValue('loginAllowed');

    		return objUser;
    	},
    	isPasswordValid: function(pass){ // TODO: Testar
    		var match = Hash.createHash(pass) == this.getDataValue('password');
    		logger.warn("passwords match: " + match);
    		return match;
    	}
  	}
})





