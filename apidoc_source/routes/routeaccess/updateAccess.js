/**
* @api {put} /api/routeaccess/:id 4. Update an existing RouteAccess
* @apiVersion 1.0.0
* @apiName PutRouteAccess
* @apiGroup RouteAccess
* @apiPermission TokenAccess
*
* @apiDescription Update a RouteAccess from database.
*
* @apiParam (Param) {Number} id ID of the existing RouteAccess.
*
* @apiParam (Body) {Number} id ID of the existing RouteAccess {Required}.
* @apiParam (Body) {Number} appClient ID of the new related appClient {Required}.
* @apiParam (Body) {Number} uriRoute   ID of the new URI Route to give access for {Required}.
*
* @apiExample Object Example:
  {
    "id": 2,
    "appClient":1,
    "uriRoute": 2
  }
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
  {
    "id": 2,
    "appClient": 1,
    "uriRoute": 2,
    "createdAt": "2016-02-17T12:56:46.999Z",
    "updatedAt": "2016-02-17T12:59:04.510Z",
    "deletedAt": null
  }
*
* @apiUse defaultResponses
*/
