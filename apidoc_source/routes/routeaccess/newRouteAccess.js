/**
* @api {post} /api/routeaccess 3. Create a new RouteAccess
* @apiVersion 1.0.0
* @apiName PostRouteAccess
* @apiGroup RouteAccess
* @apiPermission TokenAccess
*
* @apiDescription Create a new relation between a URI Route and an appClient that gives acces to this resource for the appClient.
*
* @apiExample Object Example:
  [
    {
      "appClient":1,
      "uriRoute": 1
    }
  ]
* @apiParam (Body) {Array} All relation between appClient and uriRoute to be persisted {Required}.
* @apiParam (Body) {Number} appClient ID of the related appClient {Required}.
* @apiParam (Body) {Number} uriRoute   ID of the URI Route to give access for {Required}.
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
  {
    "message": "OK",
    "total": 1
  }
*
* @apiUse defaultResponses
*/
