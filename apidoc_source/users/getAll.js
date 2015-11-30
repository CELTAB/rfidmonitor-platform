/**
* @api {get} /api/users 1. Get array of users
* @apiVersion 1.0.0
* @apiName GetUsers
* @apiGroup Users
* @apiPermission TokenAccess
*
* @apiDescription Get all users from database or a groups of users based on a query.
*
* @apiExample Example usage:
* https://localhost/api/users
*
* @apiExample Query Example:
* https://localhost/api/users?q={"limit": 2}
*
* @apiSuccess {Object[]} user       List of Users.
*
* @apiUse defaultQuery
*
* @apiSuccessExample Success-Response:
*HTTP/1.1 200 OK
*[
* {
*   "id": 1,
*   "name":"Jaime",
*   "email":"jaiminho@correios.com.br",
*   "username":"jaiminho"
* },
* {
*   "id": 2,
*   "name":"Administrator",
*   "email":"invalid@mail.com.br",
*   "username":"admin"
* }
*]
*
* @apiUse defaultResponses
*/
