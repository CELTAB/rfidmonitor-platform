/**
* @api {get} /api/dynamic?q={"original":true} 2. Get array of Original definitions
* @apiVersion 1.0.0
* @apiName GetOriginals
* @apiGroup DynamicEntity
* @apiPermission TokenAccess
*
@apiDescription Group of original definitions used to create each dynamic entity.
*
* @apiExample Example usage:
* https://localhost/api/dynamic?q={"original":true}
*
* @apiSuccess {Object[]} original       Original definitions.
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
            "identifier": "rfid_code"
          },
          {
            "field": "Plate",
            "type": "TEXT",
            "description": "Any description here",
            "allowNull": false,
            "identifier": "plate"
          },
          {
            "field": "Manufacture Year",
            "type": "DATETIME",
            "description": "Any description here",
            "allowNull": false,
            "identifier": "manufacture_year"
          },
          {
            "field": "Driver",
            "type": "ENTITY",
            "defaultReference": "full_name",
            "identifier": "driver"
          }
        ],
        "identifier": "car",
        "active": true
      }
    ]
}
*
* @apiUse defaultResponses
*/
