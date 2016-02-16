/**
* @api {get} /api/de/original/:entity 5. Get one Meta information
* @apiVersion 1.0.0
* @apiName GetOneMeta
* @apiGroup DynamicEntity
* @apiPermission TokenAccess
*
* @apiDescription Given an entity name, return the meta informatation used to define this dynamic entity.
*
* @apiParam (Param) {String} entity Name (identifier) of the Dynami Entity.
*
* @apiSuccessExample Success-Response:
*HTTP/1.1 200 OK
{
  "field": "Driver",
  "type": "ENTITY",
  "unique": [],
  "defaultReference": "full_name",
  "structureList": [
    {
      "field": "Full Name",
      "type": "TEXT",
      "description": "Any description here",
      "allowNull": false,
      "identifier": "full_name",
      "name": "full_name"
    },
    {
      "field": "Age",
      "type": "INTEGER",
      "description": "Any description here",
      "allowNull": false,
      "identifier": "age",
      "name": "age"
    }
  ],
  "identifier": "driver"
}
*
* @apiUse defaultResponses
*/
