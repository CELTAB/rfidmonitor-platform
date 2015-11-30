/**
* @api {put} /api/groups/:id 4. Update an existing Group
* @apiVersion 1.0.0
* @apiName PutGroup
* @apiGroup Groups
* @apiPermission TokenAccess
*
* @apiDescription Group of collectors. May be grouped by institutions, places, types of collectors, etc.
* Use this URI to update a group from database.
*
* @apiParam (Param) {Number} id ID of the group.
*
* @apiParam (Body) {String} name Name of the Group {Required, Unique}.
* @apiParam (Body) {String} description   Defines the Group, by a simple description.
* @apiParam (Body) {Boolean} isDefault   True for default group, null otherwise {Unique}.
*
* @apiExample Object Example:
*   {
*     "id": 1,
*     "name": "Group Name",
*     "description": "Group Description",
*     "createdAt": "2015-11-23T16:50:22.064Z",
*     "updatedAt": "2015-11-23T16:50:22.064Z",
*     "deletedAt": null,
*     "isDefault": true
*   }
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
*   {
*     "id": 1,
*     "name": "Group Name",
*     "description": "Group Description",
*     "createdAt": "2015-11-23T16:50:22.064Z",
*     "updatedAt": "2015-11-27T15:32:18.064Z",
*     "deletedAt": null,
*     "isDefault": true
*   }
*
* @apiUse defaultResponses
*/
