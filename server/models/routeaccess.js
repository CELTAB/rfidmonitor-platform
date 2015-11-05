'use strict';
var SequelizeClass = require('sequelize');
var sequelize = require(__base + 'controller/database/platformsequelize');
var UriRoute = require(__base + 'models/uriroute');
var AppClient = require(__base + 'models/appclient');

var model = sequelize.define("RouteAccess", {
	appClient: {
		type : SequelizeClass.INTEGER,
		allowNull : false,
		field : 'appClient',
		references: {
			model: AppClient,
			key:   "id"
		}
	},
	uriRoute: {
		type : SequelizeClass.INTEGER,
		allowNull : false,
		field : 'uriRoute',
		references: {
			model: UriRoute,
			key:   "id"
		}
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_route_access'
});

model.belongsTo(AppClient, {foreignKey : {name: 'appClient', allowNull: false}});
model.belongsTo(UriRoute, {foreignKey : {name: 'uriRoute', allowNull: false}});
module.exports = model;

//OBJECT EXAMPLE
/*
{
	"appClient": 1,
	"uriRoute":1
}
*/
