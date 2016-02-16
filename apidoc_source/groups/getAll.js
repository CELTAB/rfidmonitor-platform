/**
* @api {get} /api/groups 1. Get array of Groups
* @apiVersion 1.0.0
* @apiName GetGroups
* @apiGroup Groups
* @apiPermission TokenAccess
*
@apiDescription Group of collectors. May be grouped by institutions, places, types of collectors, etc.
* To get all groups or groups based on query, use this route.
*
* @apiExample Example usage:
* https://localhost/api/groups
*
* @apiExample Query Example:
* https://localhost/api/groups?q={"limit": 2}
*
* @apiSuccess {Object[]} groups       List of Groups.
*
* @apiUse defaultQuery
*
* @apiSuccessExample Success-Response:
*HTTP/1.1 200 OK
*[
*   {
*     "id": 1,
*     "name": "Default Group",
*     "description": "Auto-generated Default Group",
*     "createdAt": "2015-11-23T16:50:22.064Z",
*     "updatedAt": "2015-11-23T16:50:22.064Z",
*     "deletedAt": null,
*     "isDefault": true
*   },
*   {
*     "id": 2,
*     "name": "Itaipu",
*     "description": "All Collectors on Itaipu",
*     "createdAt": "2015-11-23T16:50:22.064Z",
*     "updatedAt": "2015-11-23T16:50:22.064Z",
*     "deletedAt": null,
*     "isDefault": null
*   }
*]
*
* @apiUse defaultResponses
*/
