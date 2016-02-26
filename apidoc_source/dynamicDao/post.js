/**
* @api {post} /api/de/dao/:entity 3. Create a new record
* @apiVersion 1.0.0
* @apiName PostRecord
* @apiGroup DynamicRecords
* @apiPermission TokenAccess
*
* @apiDescription Insert a new record on the given dynamic entity table.

* @apiExample Example usage:
* https://localhost/api/de/dao/driver

* @apiExample Object Example:
{
    "full_name": "Jaime Themailman",
    "age": 57
}
*
* @apiParam (Body) {Fields} field Field defined on dynamic entity creation {May be required and unique}.
* @apiParam (Body) {Values} value   Value fot the given field.
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
{
  "id": 1,
  "full_name": "Jaime themailman",
  "age": 57,
  "updatedAt": "2016-02-16T13:44:47.225Z",
  "createdAt": "2016-02-16T13:44:47.225Z",
  "deletedAt": null
}
*
* @apiUse defaultResponses
*/
