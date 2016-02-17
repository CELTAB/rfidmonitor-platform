/**
* @api {get} /api/routeaccess/:id 2. Get only one AccessRoute
* @apiVersion 1.0.0
* @apiName GetOneRouteAccess
* @apiGroup RouteAccess
* @apiPermission TokenAccess
*
* @apiDescription Get one especific relation between a appClient and a route with a especific access method, that gives access to this route for the appClient.
*
* @apiParam (Param) {Number} id ID of the routeaccess.
*
* @apiSuccess {Number} Id       RouteAccess ID on database.
* @apiSuccess {String} appClient       ID of the appClient that has this permission.
* @apiSuccess {String} uriRoute       ID of the route that this appClient is allowed to Access.
* @apiSuccess {String} deletedAt       Deletion datetime or null.
* @apiSuccess {String} createdAt       Creation datetime.
* @apiSuccess {String} updatedAt       Last update datetime, or creation datetime.
*
* @apiSuccessExample Success-Response:
*HTTP/1.1 200 OK
{
  "id": 1,
  "appClient": 1,
  "uriRoute": 2,
  "createdAt": "2016-02-11T12:42:54.875Z",
  "updatedAt": "2016-02-11T12:42:54.875Z",
  "deletedAt": null
}
* @apiUse defaultResponses
*/
