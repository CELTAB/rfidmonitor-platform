'use strict';
var SequelizeClass = require('sequelize');
var sequelize = require(__base + 'controller/database/platformsequelize');
var UriRoute = require(__base + 'models/uriroute');

var model = sequelize.define("RouteAccess", {
	appClient: {
		type : SequelizeClass.INTEGER,
		allowNull : false,
		field : 'app_client_id',
		references: {
			model: 'tb_plat_app_client',
			key:   "id"
		}
	},
	uriRoute: {
		type : SequelizeClass.INTEGER,
		allowNull : false,
		field : 'uri_route_id',
		references: {
			model: sequelize.model('UriRoute'),
			key:   "id"
		}
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_route_access'
});

model.belongsTo(UriRoute, {foreignKey : {name: 'uri_route_id', allowNull: false}});
module.exports = model;
