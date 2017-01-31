/**
 @api {post} /api/dynamic 1. Create a new Dynamic Entity
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
                "unique" : [ ["Full Name","Age"] ],
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
@apiParam (Body) {Array} unique Describe the field(s) that must have unique values. It is an array of arrays of uniques. {Required}.
@apiParam (Body) {String} defaultReference Same name of the field used to reference this entity. Only alllowed for fields with type ENTITY {Required}.
@apiParam (Body) {Array} structureList Defines a sub-entity with the same fields described here. Only alllowed for fields with type ENTITY {Required}.
@apiParam (Body) {String} description A short description for the given field. Used only for field with type different of ENTITY.
@apiParam (Body) {Boolean} allowNull Defines if wheather the field accepts null values. Used only for field with type different of ENTITY {Required}.


@apiSuccessExample Types Example
ENTITY: "Used to define the object as an entity. Is able to contain fields and other entities."
RFIDCODE: "A field that relates a string code to a Rfiddada code. This field enables matching an dynamic entity to a rfiddata code."
TEXT: "A field for text values (strings)"
DATETIME: "A field to store a timestamp"
INTEGER: "A field to store an integer value"
DOUBLE: "A field to store an floating point value"
GROUP: "A field that relates the entity to the system's group entity."
IMAGE: "A field that enables image upload, and holds the uploaded image to the registry."


@apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
  "message": "OK"
}

@apiUse defaultResponses
*/
