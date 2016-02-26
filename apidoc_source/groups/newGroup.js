/**
* @api {post} /api/groups 3. Create a new Group
* @apiVersion 1.0.0
* @apiName PostGroup
* @apiGroup Groups
* @apiPermission TokenAccess
*
* @apiDescription Group of collectors. May be grouped by institutions, places, types of collectors, etc.
* Insert a new groups into database.
*
* @apiExample Object Example:
*   {
*     "name": "Group Name",
*     "description": "Group Description",
*     "createdAt": "2015-11-23T16:50:22.064Z",
*     "updatedAt": "2015-11-23T16:50:22.064Z",
*     "deletedAt": null,
*     "isDefault": null
*   }
*
* @apiParam (Body) {String} name Name of the Group {Required, Unique}.
* @apiParam (Body) {String} description   Defines the Group, by a simple description.
* @apiParam (Body) {Boolean} isDefault   True for default group, null otherwise {Unique}.
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
*   {
*     "id": 1,
*     "name": "Group Name",
*     "description": "Group Description",
*     "createdAt": "2015-11-23T16:50:22.064Z",
*     "updatedAt": "2015-11-23T16:50:22.064Z",
*     "deletedAt": null,
*     "isDefault": null
*   }
*
* @apiUse defaultResponses
*/
