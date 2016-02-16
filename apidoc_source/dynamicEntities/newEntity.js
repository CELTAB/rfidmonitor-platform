/**
 @api {post} /api/de/register 1. Create a new Dynamic Entity
 @apiVersion 1.0.0
 @apiName PostDynamicEntity
 @apiGroup DynamicEntity
 @apiPermission TokenAccess

 @apiDescription Dynamic Entities to related object with monitored RFID.

 @apiExample Object Example:
  [
    {
        "field" : "Car",
        "type" : "ENTITY",
        "unique" : [["RFID Code"]],
        "defaultReference":"Plate",
        "structureList" : [
            {
                "field" : "RFID Code",
                "type" : "RFIDCODE",
                "description" : "Any description here",
                "allowNull" : false
            },
            {
                "field" : "Plate",
                "type" : "TEXT",
                "description" : "Any description here",
                "allowNull" : false
            },
            {
                "field" : "Manufacture Year",
                "type" : "DATETIME",
                "description" : "Any description here",
                "allowNull" : false
            },
            {
                "field" : "Driver",
                "type" : "ENTITY",
                "unique" : [],
                "defaultReference":"Full Name",
                "structureList" : [
                    {
                        "field" : "Full Name",
                        "type" : "TEXT",
                        "description" : "Any description here",
                        "allowNull" : false
                    },
                    {
                        "field" : "Age",
                        "type" : "INTEGER",
                        "description" : "Any description here",
                        "allowNull" : false
                    }
                ]
            }
        ]
    }
  ]

@apiParam (Body) {String} field   Defines the name for the Dynamic Entity, must be an unique name {Required, Unique}.
@apiParam (Body) {String} type   Defines the type of the data field. Follows pre-defined types {Required}.
@apiParam (Body) {Array} unique Describe the field(s) that must have unique values {Required}.
@apiParam (Body) {String} defaultReference Same name of the field used to reference this entity. Only alllowed for fields with type ENTITY {Required}.
@apiParam (Body) {Array} structureList Defines a sub-entity with the same fields described here. Only alllowed for fields with type ENTITY {Required}.
@apiParam (Body) {String} description A short description for the given field. Used only for field with type different of ENTITY.
@apiParam (Body) {Boolean} allowNull Defines if wheather the field accepts null values. Used only for field with type different of ENTITY {Required}.


@apiSuccessExample Types Example
ENTITY: "Used to create a new data type"
RFIDCODE: "Relate the field with the RDIDData entity"
TEXT: "Create a fiel that accept only text values (strings)"
DATETIME: "Field to store a timestamp"
INTEGER: "Field to store an integer value"
GROUP: "Relate the field with the Group entity"


@apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
  "message": "OK"
}

@apiUse defaultResponses
*/
