/**
* @api {get} /api/de/dao/:entity 1. Get array of records
* @apiVersion 1.0.0
* @apiName GetRecords
* @apiGroup DynamicRecords
* @apiPermission TokenAccess
*
* @apiDescription Get all records from a dynamic entity table.
*
* @apiExample Example usage:
* https://localhost/api/de/dao/driver
*
* @apiExample Query Example:
* https://localhost/api/de/dao/driver?q={"limit": 2}
*
* @apiSuccess {Object[]} records       List of records from the dynamic entity table.
*
* @apiUse defaultQuery
*
* @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
[
  {
    "id": 1,
    "full_name": "Jaime themailman",
    "age": 57,
    "createdAt": "2016-02-16T13:44:47.225Z",
    "updatedAt": "2016-02-16T13:44:47.225Z",
    "deletedAt": null
  },
  {
    "id": 2,
    "full_name": "Chavo del Ocho",
    "age": 8,
    "createdAt": "2016-02-16T13:47:30.537Z",
    "updatedAt": "2016-02-16T13:47:30.537Z",
    "deletedAt": null
  }
]

* @apiUse defaultResponses
*/


/**
* @api {get} /api/de/dao/:entity/:id 2. Get one record
* @apiVersion 1.0.0
* @apiName GetOneRecord
* @apiGroup DynamicRecords
* @apiPermission TokenAccess
*
* @apiDescription Get only one record from a dynamic entity table.
*
* @apiExample Example usage:
* https://localhost/api/de/dao/driver/2
*
* @apiExample Query Example:
* https://localhost/api/de/dao/driver/2?q={"limit": 2}
*
* @apiParam (Param) {String} entity Dynamic entity name.
* @apiParam (Param) {Number} id ID of the user.
*
* @apiSuccess {Object[]} record       One record from the dynamic entity table, based on ID end/or query.
*
* @apiUse defaultQuery
*
* @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
  "id": 2,
  "full_name": "Chavo del Ocho",
  "age": 8,
  "createdAt": "2016-02-16T13:47:30.537Z",
  "updatedAt": "2016-02-16T13:47:30.537Z",
  "deletedAt": null
}

* @apiUse defaultResponses
*/
