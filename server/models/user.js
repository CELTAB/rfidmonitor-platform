var SequelizeClass = require('sequelize');
var sequelize = require(__base + 'controller/platformsequelize');

var model = sequelize.define("User", {
	name:{
		type: SequelizeClass.STRING,
		allowNull: false
	},
	email:{
		type: SequelizeClass.STRING,
		allowNull: false,
		validate:{
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
		allowNull: false
		// set: function(pass){
		// 	this.setDataValue('password', Hash.createHash(pass));
		// }
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_user',
	defaultScope: 
		{
			attributes : ['id', 'name', 'username', 'email'],
			where: { deletedAt: null }
		},
	scopes:{
		loginScope: {
			attributes : ['id', 'username', 'password'],
			where: { deletedAt: null}	
		} 
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
    	isPasswordValid: function(pass){
    		// var match = Hash.createHash(pass) == this.getDataValue('password');
    		// return match;
    	}
  	}
});

//OBJECT EXAMPLE
/*
{
	"name":"Jonios",
	"email":"jonios@maximo.com",
	"username":"joninho",
	"password":"jonios"
}
*/	