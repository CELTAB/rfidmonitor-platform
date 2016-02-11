/**
* @api {delete} /api/appclients/:id 5. Remove an AppClient
* @apiVersion 1.0.0
* @apiName DeleteAppClient
* @apiGroup AppClients
* @apiPermission TokenAccess
*
* @apiDescription AppClients who have a token and can access resources.
*
* @apiParam (Param) {Number} id ID of the AppClient.
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
  {
    "id": 3,
    "token": "MACcN1GgtCXw3tyQqd1QkrT3GhwsWM4y",
    "description": "Default appClient for jaiminho",
    "createdAt": "2015-11-30T19:51:39.303Z",
    "updatedAt": "2015-11-30T19:51:39.303Z",
    "deletedAt": "2015-12-16T11:47:53.215Z",
    "userId": 3
  }
*
* @apiUse defaultResponses
*/
