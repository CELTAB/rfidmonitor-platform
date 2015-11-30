/**
* @api {delete} /api/groups/:id 5. Remove a Group
* @apiVersion 1.0.0
* @apiName DeleteGroup
* @apiGroup Groups
* @apiPermission TokenAccess
*
* @apiDescription Group of collectors. May be grouped by institutions, places, types of collectors, etc.
* Remove a groups from database.
*
* @apiParam (Param) {Number} id ID of the group.
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
*   {
*     "id": 1,
*     "name": "Default Group",
*     "description": "Auto-generated Default Group",
*     "createdAt": "2015-11-23T16:50:22.064Z",
*     "updatedAt": "2015-11-23T16:50:22.064Z",
*     "deletedAt": "2015-11-27T17:55:12.910Z",
*     "isDefault": null
*   }
*
* @apiUse defaultResponses
*/
