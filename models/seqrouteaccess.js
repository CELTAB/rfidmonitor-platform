var SequelizeClass = require('sequelize');
var sequelize = require('../dao/platformsequelize');
var SeqUriRoute = require('./sequriroute');

// sequelize.model('UriRoute').describe().then(function(desc){console.log(desc)});

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


model.belongsTo(SeqUriRoute, {foreignKey : 'uri_route_id'});

module.exports = model;