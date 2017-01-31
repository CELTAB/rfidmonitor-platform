/**
* @api {get} /api/routes 1. Get array of routes
* @apiVersion 1.0.0
* @apiName GetRoutes
* @apiGroup Routes
* @apiPermission TokenAccess
*
* @apiDescription Get all routes available to consume from server and its respective access Methods.
*
* @apiExample Example usage:
* https://localhost/api/routes
*
* @apiExample Query Example:
* https://localhost/api/routes?q={"limit": 4}
*
* @apiSuccess {Object[]} routes       List of available routes and respective access Methods.
*
* @apiUse defaultQuery
*
* @apiSuccessExample Success-Response:
*HTTP/1.1 200 OK
{
    count: 4,
    rows: [
      {
        "id": 1,
        "path": "/api/rfiddatas",
        "method": "POST",
        "deletedAt": null,
        "createdAt": "2016-02-11T12:42:54.362Z",
        "updatedAt": "2016-02-11T12:42:54.362Z"
      },
      {
        "id": 6,
        "path": "/api/groups",
        "method": "GET",
        "deletedAt": null,
        "createdAt": "2016-02-11T12:42:54.504Z",
        "updatedAt": "2016-02-11T12:42:54.504Z"
      },
      {
        "id": 11,
        "path": "/api/collectors",
        "method": "POST",
        "deletedAt": null,
        "createdAt": "2016-02-11T12:42:54.543Z",
        "updatedAt": "2016-02-11T12:42:54.543Z"
      },
      {
        "id": 16,
        "path": "/api/appclients",
        "method": "PUT",
        "deletedAt": null,
        "createdAt": "2016-02-11T12:42:54.583Z",
        "updatedAt": "2016-02-11T12:42:54.583Z"
      }
    ]
}

*
* @apiUse defaultResponses
*/
