/**
* @api {put} /api/de/dao/:entity/:id 4. Update an existing record
* @apiVersion 1.0.0
* @apiName PutRecord
* @apiGroup DynamicRecords
* @apiPermission TokenAccess
*
* @apiDescription Update a record from a dinamic entity table.
*
* @apiParam (Param) {String} entity Dynamic entity name.
* @apiParam (Param) {Number} id ID of the user.
*
* @apiParam (Body) {Number} ID ID of the record on dynamic table;
* @apiParam (Body) {Fields} field Field defined on dynamic entity creation {May be required and unique}.
* @apiParam (Body) {Values} value   Value fot the given field.
*
* @apiExample Object Example:
  {
    "id": 2,
    "full_name": "Chavo del Ocho",
    "age": 9
  }
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
{
  "id": 2,
  "full_name": "Chavo del Ocho",
  "age": 9,
  "createdAt": "2016-02-16T13:47:30.537Z",
  "updatedAt": "2016-02-16T15:34:49.456Z",
  "deletedAt": null
}
*
* @apiUse defaultResponses
*/
