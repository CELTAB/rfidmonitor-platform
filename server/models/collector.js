'use strict';
var SequelizeClass = require('sequelize');
var sequelize = require(__base + 'controller/database/platformsequelize');
var Group = require(__base + 'models/group');

var model = sequelize.define("Collector", {
	name: {
		type : SequelizeClass.STRING,
		allowNull : false,
		unique: 'uq_name_mac',
		field : 'name'
	},
	lat: {
		type : SequelizeClass.STRING,
		allowNull : true,
		field : 'lat'
	},
	lng: {
		type : SequelizeClass.STRING,
		allowNull : true,
		field : 'lng'
	},
	mac: {
		type : SequelizeClass.STRING,
		allowNull : false,
		unique: 'uq_name_mac',
		field : 'mac'
	},
	description: {
		type : SequelizeClass.STRING,
		allowNull : true,
		field : 'description'
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_collector',
	scopes:{
		byMac: function(macaddress){
			return{
				where: {mac: macaddress, deletedAt: null}
			}
		}
	},
	classMethods: {
		statusEnum: {
				ONLINE: 'ONLINE',
				OFFLINE: 'OFFLINE',
				UNKNOWN: 'UNKNOWN'
			}
	}
});

model.belongsTo(Group, {foreignKey: {name: 'groupId', allowNull: false}});
module.exports = model;
//OBJECT EXAMPLE
/*
{
	"name":"Aguas Bravas",
	"group_id":"1",
	"lat":"-25.432323",
	"lng":"-54.5807444",
	"mac":"8E-F3-81-5D-AD-E4",
	"description":"Canal de aguas bravas",
}
*/
