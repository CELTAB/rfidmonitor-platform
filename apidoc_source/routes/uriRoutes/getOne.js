/**
* @api {get} /api/routes/:id 2. Get only one Route
* @apiVersion 1.0.0
* @apiName GetOneRoute
* @apiGroup Routes
* @apiPermission TokenAccess
*
* @apiDescription Get one Route available to consume and its respective access method.
*
* @apiParam (Param) {Number} id ID of the route.
*
* @apiSuccess {Number} Id       Route ID on database.
* @apiSuccess {String} path       URI of the Route.
* @apiSuccess {String} method       Access method for this URI.
* @apiSuccess {String} deletedAt       Deletion datetime or null.
* @apiSuccess {String} createdAt       Creation datetime.
* @apiSuccess {String} updatedAt       Last update datetime, or creation datetime.
*
* @apiSuccessExample Success-Response:
*HTTP/1.1 200 OK
  {
    "id": 1,
    "path": "/api/rfiddatas",
    "method": "POST",
    "deletedAt": null,
    "createdAt": "2016-02-11T12:42:54.362Z",
    "updatedAt": "2016-02-11T12:42:54.362Z"
  }
* @apiUse defaultResponses
*/
