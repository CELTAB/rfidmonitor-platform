/**
* @api {delete} /api/de/dao/:entity/:id 5. Remove a Record
* @apiVersion 1.0.0
* @apiName DeleteRecord
* @apiGroup DynamicRecords
* @apiPermission TokenAccess
*
* @apiDescription Delete an existing record from a dynamic entity table, given its ID.
*
* @apiParam (Param) {String} entity Dynamic entity name.
* @apiParam (Param) {Number} id ID of the user.
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
  {
    "id": 1,
    "full_name": "Jaime themailman",
    "age": 57,
    "createdAt": "2016-02-16T13:44:47.225Z",
    "updatedAt": "2016-02-16T13:44:47.225Z",
    "deletedAt": "2016-02-16T15:38:25.424Z"
  }
*
* @apiUse defaultResponses
*/
