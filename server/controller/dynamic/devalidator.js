/****************************************************************************
**
** Copyright (C) 2015
**                     Gustavo Valiati <gustavovaliati@gmail.com>
**                     Thiago R. M. Bitencourt <thiago.mbitencourt@gmail.com>
**
** This file is part of the FishMonitoring project
**
** This program is free software; you can redistribute it and/or
** modify it under the terms of the GNU General Public License
** as published by the Free Software Foundation; version 2
** of the License.
**
** This program is distributed in the hope that it will be useful,
** but WITHOUT ANY WARRANTY; without even the implied warranty of
** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
** GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License
** along with this program; if not, write to the Free Software
** Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
**
****************************************************************************/

var logger = require('winston');
var validator = require('validator');
var Sequelize = require('sequelize');
var PlatformError = require(__base + 'utils/platformerror');
var DynamicEntity = require(__base + 'models/dynamicentity');

/**
 * Validates the definition of a new dynamic entity
 * @class DEValidator
 */
var DEValidator = function (){

}

/**
 * Is the enum that holds every possible element type for a dynamic entity composition.
 * @type {ENUM}
 * @readonly
 * @enum {String}
 */
DEValidator.prototype.typesEnum = {
	/** Field that relates the entity by a string code to the rfiddata */
	RFIDCODE : "RFIDCODE",
	/** Defines the element as an entity */
	ENTITY : "ENTITY",
	/** Field for text input. */
	TEXT : "TEXT",
	/** Field that relates the entity to a group from the system */
	GROUP : "GROUP",
	/** Field for number input. */
	INTEGER : "INTEGER",
	/** Field for floating point number  */
	DOUBLE : "DOUBLE",
	/** Field that enables an upload and attachment for the entity */
	IMAGE : "IMAGE",
	/** Field for datetime input */
	DATETIME : "DATETIME",
	/** deprecated */
	STATUS : "STATUS",
	/** deprecated */
	ID : "ID",
	/** A fallback type. */
	UNKNOWN : null
}

/**
 * Parse a typesEnum by string to a Sequelize database type.
 * @param  {typesEnum} type from DEValidator.prototype.typesEnum
 * @return {String}      The Sequelize type.
 */
DEValidator.prototype.typesEnumToSequelize = function(type){
	switch(type){
		case DEValidator.prototype.typesEnum.RFIDCODE :
			return 'Sequelize.STRING';
			break;
		case DEValidator.prototype.typesEnum.TEXT:
			return 'Sequelize.TEXT';
			break;
		case DEValidator.prototype.typesEnum.INTEGER:
			return 'Sequelize.INTEGER';
			break;
		case DEValidator.prototype.typesEnum.DOUBLE:
			return 'Sequelize.DOUBLE';
			break;
		case DEValidator.prototype.typesEnum.IMAGE:
			return 'Sequelize.STRING';
			break;
		case DEValidator.prototype.typesEnum.DATETIME:
			return 'Sequelize.DATE';
			break;
		default:
			throw new PlatformError("UNKNOWN DEValidator type to SEQUELIZE convertion ["+type+"]");
	}
}
/**
 * Parse a Sequelize Type by string format to an Sequelize object type.
 * @param  {typesEnum} type from DEValidator.prototype.typesEnum
 * @return {Object}      The Sequelize type object .
 */
DEValidator.prototype.typesStrToRealTypes = function(type){
	switch(type){
		case 'Sequelize.STRING' :
			return Sequelize.STRING;
			break;
		case 'Sequelize.TEXT':
			return Sequelize.TEXT;
			break;
		case 'Sequelize.INTEGER':
			return Sequelize.INTEGER;
			break;
		case 'Sequelize.DOUBLE':
			return Sequelize.DOUBLE;
			break;
		case 'Sequelize.DATE':
			return Sequelize.DATE;
			break;
		default:
			throw new PlatformError("UNKNOWN DEValidator type to SEQUELIZE convertion ["+type+"]");
	}
}

/**
 * Gets the typesEnum from the enum object, or return undefined if not found.
 * @param  {typesEnum} type from DEValidator.prototype.typesEnum
 * @return {String}      The Sequelize type in string format or undefined if not found.
 */
DEValidator.prototype.validateTypesEnum = function(type){
	return DEValidator.prototype.typesEnum[type];
}

/**
 * Analyses the given entity field, and every attribute that should be present.
 * @memberof DEValidator
 * @param  {Object}  field  Field object.
 * @param  {Boolean} isRoot Defines if the current field is in the root level of the definition.
 * @return {Array}         Array of errors, or false if no errors found.
 */
var validateEntityField = function(field, isRoot){

	var errors = [];

	//Check: field present and its length
	if(!field["field"]){
		errors.push({field : "field", error : "field not found"});
	}else if(!validator.isLength(field["field"], 3)){
		errors.push({obj : field.field, error : "field shorter than 3 characters"});
	}

	//Check: description present and its length
	if(field["description"] && !validator.isLength(field["description"], 3)){
		errors.push({obj : field.field, error : "description shorter than 3 characters"});
	}

	//Check: type present and if it is a valid type
	if(!field["type"] ){
		errors.push({field : field.field, error : "type not found"});
	}else if (!DEValidator.prototype.validateTypesEnum(field["type"])){
		errors.push({field : field.field, error : "type invalid"});
	}

	//Check: if root, should be an entity field.
	if(isRoot && field["type"] != DEValidator.prototype.typesEnum.ENTITY){
		errors.push({obj : field.field, error : "root object is not an ENTITY"});
	}

	//For now on, the first level of the structure should be ok.

	//Specific validations for a field of type: entity
	if(field["type"] == DEValidator.prototype.typesEnum.ENTITY){

		//Need a structureList attribute, being an not empty array.
		if(!field["structureList"]){
			errors.push({obj : field.field, error : "structureList not found"});
		} else if(!isArray(field["structureList"])){
			errors.push({obj : field.field, error : "structureList is not array"});
		} else if(field["structureList"].length == 0){
			errors.push({obj : field.field, error : "structureList is empty"});
		}else {

			var defaultReference = null;
			var defaultRefOk = false;

			//Every entity need a field reference.
			if(!field["defaultReference"]){
				errors.push({field : "defaultReference", error : "defaultReference not found"});
				field["defaultReference"]
			}else{
				defaultReference = field["defaultReference"];
			}

			//Navigate in the structureList attribute. This should contain a list of other fields. This is heading for a recursion.
			for(var ie in field["structureList"]){
				var entityField = field["structureList"][ie];

				//If the current field is the one marked as default reference, It is mandatory for it being not null.
				if(defaultReference && defaultReference == entityField.field){
					if(entityField["allowNull"] === true) {
						errors.push({field : "defaultReference", error : "defaultReference field cannot allow null"});
					}else{
							defaultRefOk = true;
					}
				}
				// Now, re-do this entire process for the current field. The second parameter is false because this is not root anymore.
				var e = validateEntityField(entityField, false);
				//In case of errors: concat it with the others possible errors found in the recursion.
				if(e)
					errors.push(e);
			}

			//If the default reference was not found in the structureList array, something is going wrong. It should be found.
			if(defaultReference && !defaultRefOk)
				errors.push({field : "defaultReference", error : "defaultReference not match to any field in the structureList"});

		}
	}else{
		// This field is not of entity type, so it is mandatory to have the allowNull attribute.
		if(!validator.isBoolean(field["allowNull"])){
			errors.push({field : field.field, error : "allowNull not found or invalid"});
		}
	}

	// If there are errors found in the recursion, the errors array has something and should be returned. Otherwise, the array is empty
	// and we can return false to symbolize that there is not errors.
	return errors.length > 0 ? errors : false;
}

/**
 * Check if the entity name given is a valid name, being unique in the system.
 * It looks among the other valid entities already present in the database.
 * @memberof DEValidator
 * @param  {Array} pool Contains an array of entities that are already valid and present in the system, and also the new one that are being validated, in a single array.
 * @return {Object}      Error message if there is a name conflict or null if everything ok.
 */
var searchForRepeatedIdentifiers = function(pool){
	var controller = {};
	for (var i in pool){
		if(controller[pool[i].identifier])
			return {"message" : "Error: entity name ["+pool[i].field+"] already in use"};

		//Add the valid identifier to the controller obj to further checking.
		controller[pool[i].identifier] = true;
	}
	//Repetition not found. Everything ok.
	return null;
}

/**
 * Modifies the original object of entities definition, to build different independent objects for each entity in the structure.
 * Every child entity is removed from its parent, an in place its identifier and type is kept.
 * @memberof DEValidator
 * @param  {Object} json is the entire definition object, containing every entity in a single structure
 * @return {Array}      an array of independent entities.
 */
var splitAndUpdateRootObj = function(json){
	var newEntitiesSplit = [];

	for (var i in json ){
		//remove structureList and unique.
		var rootObj = json[i];
		for (var is in rootObj.structureList){
			rootObj.structureList[is].identifier = normalizeString(rootObj.structureList[is].field);

			//if the field is a entity
			if(rootObj.structureList[is].type == DEValidator.prototype.typesEnum.ENTITY){
				//copy the entity
				//I know, it is ugly but is what I have for today.
				var cpEntity = JSON.parse(JSON.stringify(rootObj.structureList[is]));

				//Normalize the defaultReference field
				rootObj.structureList[is].defaultReference = normalizeString(rootObj.structureList[is].defaultReference);

				//remove what is useless for the updated field, but keep on the copy that will  be the entity itself.
				delete rootObj.structureList[is].unique;
				delete rootObj.structureList[is].structureList;

				//check inside the entity found for another entities.
				newEntitiesSplit = newEntitiesSplit.concat(splitAndUpdateRootObj([cpEntity]));
			}
		}
		//Add an identifier to the object.
		rootObj.identifier = normalizeString(rootObj.field);

		//normalize uniques
		for(var iun in rootObj.unique ){
			for (var iunn in rootObj.unique[iun]){
				rootObj.unique[iun][iunn] = normalizeString(rootObj.unique[iun][iunn]);
				logger.warn("devalidator : splitAndUpdateRootObj : if this is not string could generate problems"); //TODO improve
			}
		}
		//Normalize the defaultReference field
		rootObj.defaultReference = normalizeString(rootObj.defaultReference);
		//Add the current obj udpated.
		newEntitiesSplit.push(rootObj);
	}
	return newEntitiesSplit;
}

/**
 * Analyses, validate and reprepare a entity root object.
 * Goes through validateEntityField, splitAndUpdateRootObj, searchForRepeatedIdentifiers and finally persists the entities.
 * @param  {json}   json     The root entity object.
 * @param  {Function} callback Function called to return errors or the validated entities.
 * @return {callback_output}            Executes the callback when returning.
 */
DEValidator.prototype.validateClientRootArray = function(json, callback){

	//Check the object integrity: mandatory fields and types
	if(!json)
		return callback({"message" : "Null object"}, null);

	if (!isArray(json))
		return callback({"message" : "Not an Array"}, null);

	if (json.length == 0)
		return callback({"message" : "Empty Array"}, null);

	//Call the recursive validation function for the object fields.
	for (var i in json){
		var rootObj = json[i];
		var errors = validateEntityField(rootObj, true);
		if(errors)
			return callback(errors, null);
	}

	/*
	Find and replace entities by a processed version.
	Child entities are removed from the parent entity, keeping in place its reference only.
	*/
	var newEntities = splitAndUpdateRootObj(json);
	// logger.debug("##" +JSON.stringify(newEntities, null , '\t'));
	if(newEntities.length == 0){
		logger.error('Unexpected behavior: newEntities list is empty after splitAndUpdateRootObj');
		return callback({ "message" : "Unexpected behavior: newEntities list is empty after splitAndUpdateRootObj"}, null);
	}

	//Temporary entities pool. Used for unique identifier validation.
	var entitiesPool = [];

	//Add the new entities the client is trying to create.
	entitiesPool = entitiesPool.concat(newEntities);

	//Add the current entities already present in the system.
	DynamicEntity.findAll({attributes : ['original']}).then(function(entities){
		// The entities from database are raw strings. The must be parsed.
		for(var icer in entities){
			entitiesPool.push(JSON.parse(entities[icer].original));
		}

		//Find repeated names. Return errors if so.
		var error = searchForRepeatedIdentifiers(entitiesPool);
		if(error){
			logger.debug(error);
			return callback(error, null);
		}

		//Persist the new entities as they are ok.
		var bulkArray = []
		for (var j in newEntities){
			var obj = {};
			obj.identifier = newEntities[j].identifier;
			obj.original = JSON.stringify(newEntities[j], null, null);
			bulkArray.push(obj);
		}

		DynamicEntity.bulkCreate(bulkArray).then(function(){
			//No errors on validateClientRootArray
			callback(null, newEntities);
		}).catch(function(e){
			logger.error('BulkCreate error on deValidator : ' +e);
			return callback(e, newEntities);
		});
	}).catch(function(e){
		logger.error('FindAll error on deValidator: ' + e);
		return callback(e, null);
	});
}

//not used anymore
var findFieldByNameAndType = function(field, name, type){
/*
	Search on the current field for name and type combination, and recursive for fields under a possible
	structureList if the current field an entity.
*/
	for (var i in field.structureList){
		var f = field.structureList[i];
		if ((f['field'] && f['field'] == name ) && (f['type'] && f['type'] == type))
			return true;
		else if(f['structureList'])
			return findFieldByNameAndType(f, name, type);
	}
	return false;
}
//not used anymore
var createFieldMeta = function(field){
	var meta = {};

	//TODO sanitize.
	meta.identifier = normalizeString(field.field);

	if(field.type == DEValidator.prototype.typesEnum.ENTITY){

		var idObj = {};
		idObj.field = "_id";
		idObj.type = "ID";
		idObj.allowNull = true; //serial
		idObj.description = "Default id inserted by platform.";
		field.structureList.push(idObj);

		for(var iunq in field.unique){
			for(var iunqb in field.unique[iunq]){
				/*
				If the unique key here refers to an entity, then we need to change its name adding _id, because it will be a foreign key.
				Changing for example, 'cars' to 'cars_id', because it is an entity and a table 'tb_cars' will be created later, and this field
				cannot be named just as 'cars' but 'cars_id' correctly being a foreign key pattern.
				*/
				if(findFieldByNameAndType(field, field.unique[iunq][iunqb], DEValidator.prototype.typesEnum.ENTITY)){
					field.unique[iunq][iunqb] += '_id';
				}
				field.unique[iunq][iunqb] = normalizeString(field.unique[iunq][iunqb]);
			}
		}

		meta.dbPk = '_id';
		meta.dbTableName = 'tb_' + meta.identifier;

		for(var istrl in field.structureList){
			field.structureList[istrl] = createFieldMeta(field.structureList[istrl]);
		}
	}

	field.meta = meta;
	return field;
}

/**
 * Check if the given variable is an object.
 * @memberof DEValidator
 * @param  {Object}  a The given variable for checking.
 * @return {Boolean}   If it is object or not.
 */
var isObject = function(a) {
    return (!!a) && (a.constructor === Object);
};

/**
 * Check if the given variable is an array.
 * @memberof DEValidator
 * @param  {Array}  a The given variable for checking.
 * @return {Boolean}   If it is array or not.
 */
var isArray = function(a) {
    return (!!a) && (a.constructor === Array);
};

/**
 * Check if the given object has not attributes.
 * @memberof DEValidator
 * @param  {Object}  a The given variable for checking.
 * @return {Boolean}   If it has zero attributes or not.
 */
var isObjectEmpty = function(a){
	return Object.keys(a).length == 0;
}

/*
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
//TODO: This is also into utils. Test with Gustavo's Help
//var defaultDiacriticsRemovalap = require(__base + 'utils/diacritics');
    var defaultDiacriticsRemovalap = [
        {'base':'A', 'letters':'\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F'},
        {'base':'AA','letters':'\uA732'},
        {'base':'AE','letters':'\u00C6\u01FC\u01E2'},
        {'base':'AO','letters':'\uA734'},
        {'base':'AU','letters':'\uA736'},
        {'base':'AV','letters':'\uA738\uA73A'},
        {'base':'AY','letters':'\uA73C'},
        {'base':'B', 'letters':'\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181'},
        {'base':'C', 'letters':'\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E'},
        {'base':'D', 'letters':'\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779'},
        {'base':'DZ','letters':'\u01F1\u01C4'},
        {'base':'Dz','letters':'\u01F2\u01C5'},
        {'base':'E', 'letters':'\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E'},
        {'base':'F', 'letters':'\u0046\u24BB\uFF26\u1E1E\u0191\uA77B'},
        {'base':'G', 'letters':'\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E'},
        {'base':'H', 'letters':'\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D'},
        {'base':'I', 'letters':'\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197'},
        {'base':'J', 'letters':'\u004A\u24BF\uFF2A\u0134\u0248'},
        {'base':'K', 'letters':'\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2'},
        {'base':'L', 'letters':'\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780'},
        {'base':'LJ','letters':'\u01C7'},
        {'base':'Lj','letters':'\u01C8'},
        {'base':'M', 'letters':'\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C'},
        {'base':'N', 'letters':'\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4'},
        {'base':'NJ','letters':'\u01CA'},
        {'base':'Nj','letters':'\u01CB'},
        {'base':'O', 'letters':'\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C'},
        {'base':'OI','letters':'\u01A2'},
        {'base':'OO','letters':'\uA74E'},
        {'base':'OU','letters':'\u0222'},
        {'base':'OE','letters':'\u008C\u0152'},
        {'base':'oe','letters':'\u009C\u0153'},
        {'base':'P', 'letters':'\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754'},
        {'base':'Q', 'letters':'\u0051\u24C6\uFF31\uA756\uA758\u024A'},
        {'base':'R', 'letters':'\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782'},
        {'base':'S', 'letters':'\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784'},
        {'base':'T', 'letters':'\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786'},
        {'base':'TZ','letters':'\uA728'},
        {'base':'U', 'letters':'\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244'},
        {'base':'V', 'letters':'\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245'},
        {'base':'VY','letters':'\uA760'},
        {'base':'W', 'letters':'\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72'},
        {'base':'X', 'letters':'\u0058\u24CD\uFF38\u1E8A\u1E8C'},
        {'base':'Y', 'letters':'\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE'},
        {'base':'Z', 'letters':'\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762'},
        {'base':'a', 'letters':'\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250'},
        {'base':'aa','letters':'\uA733'},
        {'base':'ae','letters':'\u00E6\u01FD\u01E3'},
        {'base':'ao','letters':'\uA735'},
        {'base':'au','letters':'\uA737'},
        {'base':'av','letters':'\uA739\uA73B'},
        {'base':'ay','letters':'\uA73D'},
        {'base':'b', 'letters':'\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253'},
        {'base':'c', 'letters':'\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184'},
        {'base':'d', 'letters':'\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A'},
        {'base':'dz','letters':'\u01F3\u01C6'},
        {'base':'e', 'letters':'\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD'},
        {'base':'f', 'letters':'\u0066\u24D5\uFF46\u1E1F\u0192\uA77C'},
        {'base':'g', 'letters':'\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F'},
        {'base':'h', 'letters':'\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265'},
        {'base':'hv','letters':'\u0195'},
        {'base':'i', 'letters':'\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131'},
        {'base':'j', 'letters':'\u006A\u24D9\uFF4A\u0135\u01F0\u0249'},
        {'base':'k', 'letters':'\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3'},
        {'base':'l', 'letters':'\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747'},
        {'base':'lj','letters':'\u01C9'},
        {'base':'m', 'letters':'\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F'},
        {'base':'n', 'letters':'\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5'},
        {'base':'nj','letters':'\u01CC'},
        {'base':'o', 'letters':'\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275'},
        {'base':'oi','letters':'\u01A3'},
        {'base':'ou','letters':'\u0223'},
        {'base':'oo','letters':'\uA74F'},
        {'base':'p','letters':'\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755'},
        {'base':'q','letters':'\u0071\u24E0\uFF51\u024B\uA757\uA759'},
        {'base':'r','letters':'\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783'},
        {'base':'s','letters':'\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B'},
        {'base':'t','letters':'\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787'},
        {'base':'tz','letters':'\uA729'},
        {'base':'u','letters': '\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289'},
        {'base':'v','letters':'\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C'},
        {'base':'vy','letters':'\uA761'},
        {'base':'w','letters':'\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73'},
        {'base':'x','letters':'\u0078\u24E7\uFF58\u1E8B\u1E8D'},
        {'base':'y','letters':'\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF'},
        {'base':'z','letters':'\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763'}
    ];

    var diacriticsMap = {};
    for (var i=0; i < defaultDiacriticsRemovalap.length; i++){
        var letters = defaultDiacriticsRemovalap[i].letters;
        for (var j=0; j < letters.length ; j++){
            diacriticsMap[letters[j]] = defaultDiacriticsRemovalap[i].base;
        }
    }

    // "what?" version ... http://jsperf.com/diacritics/12
    var removeDiacritics = function(str) {
        return str.replace(/[^\u0000-\u007E]/g, function(a){
           return diacriticsMap[a] || a;
        });
    }
		var whitelist = function(str){
			var wlist = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";
			var regex = new RegExp('[^' + wlist + ']', 'g');
			return str.replace(regex, '');
		}

/**
 * A function to normalize a given string.
 * Applies trim, normalize special chars, apply a whitelist of allowed chars in the string.
 * @memberof DEValidator
 * @param  {String} str Original string not normalized.
 * @return {String}     The normalized string.
 */
    var normalizeString = function(str){
    	str = validator.trim(str);
    	str = removeDiacritics(str);
    	str = str.toLowerCase();
    	str = str.replace(/\s/g, '_'); // remove whitespaces.
			str = whitelist(str); //task #2231

    	return str;
    }

module.exports = DEValidator;
