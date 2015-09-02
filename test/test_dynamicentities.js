var expect = require("chai").expect;
var DynamicEntities = require('../controllers/dynamicentities');
var logger = require('winston');

//disable logger console prints present into app´s classes
logger.remove(logger.transports.Console);

// describe("DynamicEntities", function(){
// 	describe("#Entity Creation Request", function(){

// 		//ANY THING GLOBAL FOR THIS TEST SHOULD BE HERE

// 		//END OF : ANY THING GLOBAL FOR THIS TEST SHOULD BE HERE

// 		it("JSON obj should be valid, for a VALID json array example.", function(){

// 			var de = new DynamicEntities();
// 			de.validateEntityCreateObject(testObj_complexValidObject, function(err, isValid){
// 				if(err)
// 					console.log(JSON.stringify(err));

// 				expect(isValid).to.be.true;				
// 			});
// 		});

// 		it("JSON obj should be invalid, for a NULL json object example.", function(){
			
// 			var de = new DynamicEntities();
// 			de.validateEntityCreateObject(null, function(err, isValid){
// 				if(err)
// 					console.log(JSON.stringify(err));

// 				expect(isValid).to.be.false;				
// 			});
// 		});

// 		it("JSON obj should be invalid, for a EMPTY json array example.", function(){
			
// 			var de = new DynamicEntities();
// 			de.validateEntityCreateObject([], function(err, isValid){
// 				if(err)
// 					console.log(JSON.stringify(err));

// 				expect(isValid).to.be.false;				
// 			});
// 		});

// 		var testObj_root_randonObj = [{"abc" : "haduken"},	{}];

// 		it("JSON obj should be invalid, for a RANDON json object.", function(){
			
// 			var de = new DynamicEntities();
// 			de.validateEntityCreateObject(testObj_root_randonObj, function(err, isValid){
// 				if(err)
// 					console.log(JSON.stringify(err));

// 				expect(isValid).to.be.false;				
// 			});
// 		});

// 		var testObj_root_withoutField = 
// 			[
// 				{
// 					"type": "ENTITY", 
// 					"structureList" : [
// 						{
// 							"field" : "Código RFID",
// 							"type" : "RFIDCODE"
// 						}
// 					]
// 				}
// 			];
// 		it("JSON obj should be invalid, for a VALID json object with WITHOUT field.", function(){
			
// 			var de = new DynamicEntities();
// 			de.validateEntityCreateObject(testObj_root_withoutField, function(err, isValid){
// 				if(err)
// 					console.log(JSON.stringify(err));

// 				expect(isValid).to.be.false;				
// 			});
// 		});

// 		var testObj_invalidFieldtypeForEntity = 
// 			[
// 				{
// 					"field" : "123", 
// 					"type": "somethingelse", 
// 					"structureList" : [
// 						{
// 							"field" : "Código RFID",
// 							"type" : "RFIDCODE"
// 						}
// 					]
// 				}
// 			];
// 		it("JSON obj should be invalid, for a VALID json object with INVALID TYPE for a entity", function(){
			
// 			var de = new DynamicEntities();
// 			de.validateEntityCreateObject(testObj_invalidFieldtypeForEntity, function(err, isValid){
// 				if(err)
// 					console.log(JSON.stringify(err));

// 				expect(isValid).to.be.false;				
// 			});
// 		});

// 		var testObj_invalidFieldtype = 
// 			[
// 				{
// 					"field" : "123", 
// 					"type": "ENTITY", 
// 					"structureList" : [
// 						{
// 							"field" : "Código RFID",
// 							"type" : "NOTHING"
// 						}
// 					]
// 				}
// 			];
// 		it("JSON obj should be invalid, for a VALID json object with INVALID TYPE", function(){
			
// 			var de = new DynamicEntities();
// 			de.validateEntityCreateObject(testObj_invalidFieldtype, function(err, isValid){
// 				if(err)
// 					console.log(JSON.stringify(err));

// 				expect(isValid).to.be.false;				
// 			});
// 		});

// 		var testObj_entity_withoutStructureList = 
// 			[
// 				{
// 					"field" : "123", 
// 					"type": "ENTITY"
// 				}
// 			];
// 		it("JSON obj should be invalid, for a VALID json object WITHOUT structureList.", function(){
			
// 			var de = new DynamicEntities();
// 			de.validateEntityCreateObject(testObj_entity_withoutStructureList, function(err, isValid){
// 				if(err)
// 					console.log(JSON.stringify(err));

// 				expect(isValid).to.be.false;				
// 			});
// 		});

// 		var testObj_entity_emptyStructureList = 
// 			[
// 				{
// 					"field" : "123", 
// 					"type": "ENTITY", 
// 					"structureList" : []
// 				}
// 			];
// 		it("JSON obj should be invalid, for a VALID json object with EMPTY structureList.", function(){
			
// 			var de = new DynamicEntities();
// 			de.validateEntityCreateObject(testObj_entity_emptyStructureList, function(err, isValid){
// 				if(err)
// 					console.log(JSON.stringify(err));

// 				expect(isValid).to.be.false;				
// 			});
// 		});

// 		var testObj_fieldSmall = 
// 			[
// 				{
// 					"field" : "a", 
// 					"type": "ENTITY", 
// 					"structureList" : [
// 						{
// 							"field" : "Código RFID",
// 							"type" : "RFIDCODE"
// 						}
// 					]
// 				}
// 			];
// 		it("JSON obj should be invalid, for a VALID json object with SMALL field name.", function(){
			
// 			var de = new DynamicEntities();
// 			de.validateEntityCreateObject(testObj_fieldSmall, function(err, isValid){
// 				if(err)
// 					console.log(JSON.stringify(err));

// 				expect(isValid).to.be.false;				
// 			});
// 		});
		

// 	});

// 	describe("#Entity Creation Request 2", function(){
// 		it("test.", function(){
			
// 			var de = new DynamicEntities();
// 			de.createEntity(testObj_MetaComplexValidObject, function(err, result){
// 				if(err)
// 					console.log(JSON.stringify(err));

// 				expect(result).to.be.true;				
// 			});
// 		});
// 	});

// });

//OBJECT DICTIONARY

var testObj_smallValidObjectFromUser = 
			[
				{
					"field" : "Peixes Marcados",
					"type" : "ENTITY",
					"description" : "São os carros que trafegam no parque",
					"unique" : [],
					"structureList" : [
						{
							"field" : "Código RFID",
							"type" : "RFIDCODE"
						}
					]
				}
			];

var testObj_complexValidObject = [
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
				"notNull" : false
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
						"notNull" : false
					},
					{
						"field" : "Foto",
						"type" : "IMAGE",
						"description" : "",
						"notNull" : false
					}
				]
			},
			{
				"field" : "Instituição",
				"type" : "TEXT",
				"description" : "",
				"notNull" : false
			},
			{
				"field" : "Local de Captura",
				"type" : "TEXT",
				"description" : "",
				"notNull" : false
			},
			{
				"field" : "Local de Soltura",
				"type" : "TEXT",
				"description" : "",
				"notNull" : false
			},
			{
				"field" : "Comprimento total do peixe",
				"type" : "NUMBER",
				"description" : "",
				"notNull" : false
			},
			{
				"field" : "Data de Captura",
				"type" : "DATETIME",
				"description" : "",
				"notNull" : false
			}
		]
	},
	{
		"field" : "Carros",
		"type" : "ENTITY",
		"unique" : [],
		"structureList" : [
			{
				"field" : "Código RFID",
				"type" : "RFIDCODE",
				"description" : "",
				"notNull" : false
			},
			{
				"field" : "Ano de Fabricação",
				"type" : "DATETIME",
				"description" : "",
				"notNull" : false
			},
			{
				"field" : "Motorista",
				"type" : "ENTITY",
				"unique" : [],
				"structureList" : [
					{
						"field" : "Nome Completo",
						"type" : "TEXT",
						"description" : "",
						"notNull" : false
					},
					{
						"field" : "Idade",
						"type" : "NUMBER",
						"description" : "",
						"notNull" : false
					}
				]
			}
		]
	}
]

var de = new DynamicEntities();
de.createEntity(testObj_complexValidObject , function(err, result){
	if(err)
		console.log(JSON.stringify(err));

	console.log(result);				
});