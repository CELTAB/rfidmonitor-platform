'use strict';
var SequelizeClass = require('sequelize');
var sequelize = require(__base + 'controller/database/platformsequelize');

var model = sequelize.define("DynamicEntity", {
	identifier : {
		type : SequelizeClass.STRING,
		unique: 'uq_identifier_and_deletedAt',
		allowNull : false
	},
	sequelizeModel: {
		type : SequelizeClass.TEXT,
		allowNull : true
	},
	sequelizeOptions: {
		type : SequelizeClass.TEXT,
		allowNull : true
	},
	original: {
		type : SequelizeClass.TEXT,
		allowNull : true
	},
	meta: {
		type : SequelizeClass.TEXT,
		allowNull : true
	},
	active: {
		type: SequelizeClass.BOOLEAN,
		allowNull : false,
		defaultValue: true
	},
	deletedAt : {
		type : SequelizeClass.DATE,
		unique : 'uq_identifier_and_deletedAt' //this enables having 1 unique identifier not deleted, and repeated identifiers deleted.
	}
},
{
	paranoid : true,
	freezeTableName: true,
	tableName: 'tb_plat_dynamic_entity'
});

module.exports = model;

//OBJECT EXAMPLE
/*
[
	{
			"field" : "Peixes Marcados",
			"type" : "ENTITY",
			"description" : "São os carros que trafegam no parque",
			"unique" : [
					["Código RFID" ,"Espécie"]
			],
			"structureList" : [
					{
							"field" : "Código RFID",
							"type" : "RFIDCODE",
							"description" : "teste",
							"allowNull" : false
					},
					{
							"field" : "Espécie",
							"type" : "ENTITY",
							"description" : "Alguma descrição sobre os Especies.",
							"unique" : [],
							"structureList" : [
									{
											"field" : "Nome",
											"type" : "TEXT",
											"description" : "",
											"allowNull" : false
									},
									{
											"field" : "Foto",
											"type" : "IMAGE",
											"description" : "",
											"allowNull" : false
									}
							]
					},
					{
							"field" : "Instituição",
							"type" : "TEXT",
							"description" : "",
							"allowNull" : false
					},
					{
							"field" : "Local de Captura",
							"type" : "TEXT",
							"description" : "",
							"allowNull" : false
					},
					{
							"field" : "Local de Soltura",
							"type" : "TEXT",
							"description" : "",
							"allowNull" : false
					},
					{
							"field" : "Comprimento total do peixe",
							"type" : "DOUBLE",
							"description" : "",
							"allowNull" : false
					},
					{
							"field" : "Data de Captura",
							"type" : "DATETIME",
							"description" : "",
							"allowNull" : false
					}
			]
	}
]
*/
