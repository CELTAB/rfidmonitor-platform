/**
* @api {get} /api/routeaccess 1. Get array of Access permissions
* @apiVersion 1.0.0
* @apiName GetRouteAccess
* @apiGroup RouteAccess
* @apiPermission TokenAccess
*
* @apiDescription Get all relations between a appClient and a route with a especific access method, that gives access to this route for the appClient.
*
* @apiExample Example usage:
* https://localhost/api/routeaccess
*
* @apiExample Query Example:
* https://localhost/api/routeaccess?q={"limit": 1}
*
* @apiSuccess {Object[]} routeaccess       List of relations between user and route.
*
* @apiUse defaultQuery
*
* @apiSuccessExample Success-Response:
*HTTP/1.1 200 OK
{
    count: 1,
    rows: [
      {
        "id": 1,
        "appClient": 1,
        "uriRoute": 2,
        "createdAt": "2016-02-11T12:42:54.875Z",
        "updatedAt": "2016-02-11T12:42:54.875Z",
        "deletedAt": null
      }
    ]
}

*
* @apiUse defaultResponses
*/
