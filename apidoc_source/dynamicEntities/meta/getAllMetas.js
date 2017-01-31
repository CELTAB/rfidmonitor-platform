/**
* @api {get} /api/dynamic 4. Get array of Meta informations
* @apiVersion 1.0.0
* @apiName GetMeta
* @apiGroup DynamicEntity
* @apiPermission TokenAccess
*
@apiDescription Group of meta informations used to define each dynamic entity.
*
* @apiExample Example usage:
* https://localhost/api/dynamic
*
* @apiSuccess {Object[]} meta       Meta Informations.
*
* @apiSuccessExample Success-Response:
*HTTP/1.1 200 OK
{
    count: 2,
    rows: [
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
      },
      {
        "field": "Car",
        "type": "ENTITY",
        "unique": [
          [
            "rfid_code"
          ]
        ],
        "defaultReference": "plate",
        "structureList": [
          {
            "field": "RFID Code",
            "type": "RFIDCODE",
            "description": "Any description here",
            "allowNull": false,
            "identifier": "rfid_code",
            "name": "rfid_code"
          },
          {
            "field": "Plate",
            "type": "TEXT",
            "description": "Any description here",
            "allowNull": false,
            "identifier": "plate",
            "name": "plate"
          },
          {
            "field": "Manufacture Year",
            "type": "DATETIME",
            "description": "Any description here",
            "allowNull": false,
            "identifier": "manufacture_year",
            "name": "manufacture_year"
          },
          {
            "field": "Driver",
            "type": "ENTITY",
            "defaultReference": "full_name",
            "identifier": "driver_id",
            "name": "driver"
          }
        ],
        "identifier": "car"
      }
    ]
}

*
* @apiUse defaultResponses
*/
