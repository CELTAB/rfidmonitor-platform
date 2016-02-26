/**
* @api {put} /api/users/:id 4. Update an existing User
* @apiVersion 1.0.0
* @apiName PutUser
* @apiGroup Users
* @apiPermission TokenAccess
*
* @apiDescription Update a User from database.
*
* @apiParam (Param) {Number} id ID of the user.
*
* @apiParam (Body) {String} name Name of the User {Required, Unique}.
* @apiParam (Body) {String} email   Email to get in touch with the user {Required}.
* @apiParam (Body) {String} username       Username to log in the system {Required, Unique}.
* @apiParam (Body) {String} password       Password to log in the system {Required}.
*
* @apiExample Object Example:
* {
*   "id": 1,
*   "name":"Jaime",
*   "email":"jaiminho@correios.com.br",
*   "username":"jaiminho",
*   "password":"jaiminho"
* }
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
* {
*   "id": 1,
*   "name":"Jaime",
*   "email":"jaiminho@correios.com.br",
*   "username":"jaiminho",
*   "updatedAt": "2015-11-27T15:32:18.064Z"
* }
*
* @apiUse defaultResponses
*/
