/**
* @api {get} /api/dynamic/:entity?q={"original":true} 3. Get one Original definition
* @apiVersion 1.0.0
* @apiName GetOneOriginal
* @apiGroup DynamicEntity
* @apiPermission TokenAccess
*
* @apiDescription Given an entity name, return the original definitions used to create this dynamic entity.
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
      "identifier": "full_name"
    },
    {
      "field": "Age",
      "type": "INTEGER",
      "description": "Any description here",
      "allowNull": false,
      "identifier": "age"
    }
  ],
  "identifier": "driver",
  "active": true
}
*
* @apiUse defaultResponses
*/
