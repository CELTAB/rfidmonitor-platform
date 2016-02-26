/**
* @api {delete} /api/users/:id 5. Remove a User
* @apiVersion 1.0.0
* @apiName DeleteUser
* @apiGroup Users
* @apiPermission TokenAccess
*
* @apiDescription Remove a User from database.
*
* @apiParam (Param) {Number} id ID of the user.
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
* {
*   "id": 1,
*   "name":"Jaime",
*   "email":"jaiminho@correios.com.br",
*   "username":"jaiminho",
*   "deletedAt": "2015-11-27T17:55:12.910Z"
* }
*
* @apiUse defaultResponses
*/
