/**
* @api {get} /api/users/:id 2. Get only one User
* @apiVersion 1.0.0
* @apiName GetOneUser
* @apiGroup Users
* @apiPermission TokenAccess
*
* @apiDescription Get one user from database by its ID.
*
* @apiParam (Param) {Number} id ID of the user.
*
* @apiSuccess {Number} Id       User ID on database.
* @apiSuccess {String} name       Name of the User.
* @apiSuccess {String} email       E-mail to get in touch with the user.
* @apiSuccess {String} username       Username to log in the system.
* @apiSuccess {String} password       Password to log in the system.
*
* @apiSuccessExample Success-Response:
*HTTP/1.1 200 OK
* {
*   "id": 1,
*   "name":"Jaime",
*   "email":"jaiminho@correios.com.br",
*   "username":"jaiminho"
* }
*
* @apiUse defaultResponses
*/
