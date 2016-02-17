/**
* @api {delete} /api/routeaccess/:id 5. Remove a RouteAccess
* @apiVersion 1.0.0
* @apiName DeleteRouteAccess
* @apiGroup RouteAccess
* @apiPermission TokenAccess
*
* @apiDescription Remove an existing RouteAccess from database.
*
* @apiParam (Param) {Number} id ID of the RouteAccess.
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
  {
    "id": 2,
    "appClient": 1,
    "uriRoute": 2,
    "createdAt": "2016-02-17T12:56:46.999Z",
    "updatedAt": "2016-02-17T12:59:04.510Z",
    "deletedAt": "2016-02-17T13:01:55.123Z"
  }
*
* @apiUse defaultResponses
*/
