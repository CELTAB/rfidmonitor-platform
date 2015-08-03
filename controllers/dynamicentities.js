var logger = require('winston');
var validator = require('validator');

var DynamicEntities = function (){

}

DynamicEntities.prototype.typesEnum = {
	RFIDCODE : "RFIDCODE", 
	ENTITY : "ENTITY", 
	TEXT : "TEXT",
	GROUP : "GROUP",
	NUMBER : "NUMBER",
	IMAGE : "IMAGE",
	DATETIME : "DATETIME",
	UNKNOWN : null
}

DynamicEntities.prototype.validateTypesEnum = function(type){
	return DynamicEntities.prototype.typesEnum[type];
}

var validateEntityObject = function(rootObj){

	var errors = [];

	if(!rootObj["field"]){
		errors.push({obj : "rootObj", error : "field not found"}); 
	}else if(!validator.isLength(rootObj["field"], 3)){
		errors.push({obj : rootObj.field, error : "field shorter than 3 characters"}); 
	}

	if(!rootObj["type"]){
		errors.push({obj : rootObj.field, error : "type not found"});
	} else if(rootObj["type"] != DynamicEntities.prototype.typesEnum.ENTITY){
		errors.push({obj : rootObj.field, error : "invalid type for a ENTITY object."});
	}

	if(!rootObj["structureList"]){
		errors.push({obj : rootObj.field, error : "structureList not found"});
	} else if(!isArray(rootObj["structureList"])){
		errors.push({obj : rootObj.field, error : "structureList is not array"});
	} else if(rootObj["structureList"].length == 0){
		errors.push({obj : rootObj.field, error : "structureList is empty"});
	}else {
		for(var ie in Object.keys(rootObj["structureList"])){
			var entityField = rootObj["structureList"][ie];

			var e = validateEntityField(entityField);
			if(e)
				errors.push(e);
		}
	}

	return errors.length > 0 ? errors : false;
}

var validateEntityField = function(field){

	var errors = [];

	if(!field["field"]){
		errors.push({field : "field", error : "field not found"});
	}else if(!validator.isLength(field["field"], 3)){
		errors.push({obj : field.field, error : "field shorter than 3 characters"}); 
	}

	if(!field["type"] ){
		errors.push({field : field.field, error : "type not found"});
	}else if (!DynamicEntities.prototype.validateTypesEnum(field["type"])){
		errors.push({field : field.field, error : "type invalid"});
	}

	if(field["type"] == DynamicEntities.prototype.typesEnum.ENTITY){
		var e = validateEntityObject(field);
		if(e)
			errors.push(e);
	}

	return errors.length > 0 ? errors : false;
}

DynamicEntities.prototype.validateEntityCreateObject = function(json, callback){

	if(!json)
		return callback("Null object", false);

	if (!isArray(json)){
		return callback("Not an Array", false);
	}

	if (json.length == 0 ){
		return callback("Empty Array", false);
	}

	for (var ir in Object.keys(json)){

		var rootObj = json[ir];
		var errors = validateEntityObject(rootObj);
		if(errors)
			return callback(errors, false);
	}

	return callback(null, true);
}

DynamicEntities.prototype.createEntity = function(json, callback){

	validateEntityCreateObject(json, function(err, isValid){

		// callback(err, result);
		callback(null, null);
	});

}

module.exports = DynamicEntities;

var isObject = function(a) {
    return (!!a) && (a.constructor === Object);
};

var isArray = function(a) {
    return (!!a) && (a.constructor === Array);
};

var isObjectEmpty = function(a){
	return Object.keys(a).length == 0;
}

var tmp = [
	{
		"field" : "Peixes Marcados",
		"type" : "ENTITY",
		"structureList" : [
			{
				"field" : "Código RFID",
				"type" : "RFIDCODE"
			},
			{
				"field" : "Espécie",
				"type" : "ENTITY",
				"structureList" : [
					{
						"field" : "Nome",
						"type" : "TEXT"
					},
					{
						"field" : "Foto",
						"type" : "IMAGE"
					}
				]
			},
			{
				"field" : "Instituição",
				"type" : "GROUP"
			},
			{
				"field" : "Local de Captura",
				"type" : "TEXT"
			},
			{
				"field" : "Local de Soltura",
				"type" : "TEXT"
			},
			{
				"field" : "Comprimento total do peixe",
				"type" : "NUMBER"
			},
			{
				"field" : "Data de Captura",
				"type" : "DATETIME"
			}
		]
	},
	{
		"field" : "Carros",
		"type" : "ENTITY",
		"structureList" : [
			{
				"field" : "Código RFID",
				"type" : "RFIDCODE"
			},
			{
				"field" : "Ano de Fabricação",
				"type" : "DATETIME"
			},
			{
				"field" : "Motorista",
				"type" : "ENTITY",
				"structureList" : [
					{
						"field" : "Nome Completo",
						"type" : "TEXT"
					},
					{
						"field" : "Idade",
						"type" : "NUMBER"
					}
				]
			}
		]
	}
]