var SequelizeClass = require('sequelize');
var sequelize = require('../dao/platformsequelize');
var SeqUser = require('./sequser');
var Tokenizer = require('../utils/baseutils').randomChars;

var logger = require('winston');

logger.info(Tokenizer.uid(32));

var model = sequelize.define("AppClient", {
	token: {
		type : SequelizeClass.STRING,
		allowNull : false,
		unique : true,
		field : 'token'
	},
	description: {
		type : SequelizeClass.STRING,
		allowNull : false,
		field : 'description',
		set: function(desc){
      		this.setDataValue('description', desc);
      		//TODO: When using login, decoment the line bellow
      		this.setDataValue('token', Tokenizer.uid(32));
		}
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_app_client'
});

model.belongsTo(SeqUser, {foreignKey: 'user_id'});

module.exports = model;