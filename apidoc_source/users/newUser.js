/**
* @api {post} /api/users 3. Create a new User
* @apiVersion 1.0.0
* @apiName PostUser
* @apiGroup Users
* @apiPermission TokenAccess
*
* @apiDescription Insert a new User on database.
*
* @apiExample Object Example:
* {
*   "name":"Jaime",
*   "email":"jaiminho@correios.com.br",
*   "username":"jaiminho",
*   "password":"jaiminho",
* }
*
* @apiParam (Body) {String} name Name of the User {Required, Unique}.
* @apiParam (Body) {String} email   Email to get in touch with the user {Required}.
* @apiParam (Body) {String} username       Username to log in the system {Required, Unique}.
* @apiParam (Body) {String} password       Password to log in the system {Required}.
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
* {
*   "id": 1,
*   "name":"Jaime",
*   "email":"jaiminho@correios.com.br",
*   "username":"jaiminho",
*   "appClient": {
*     "token": "uNgZnpGeKpr8JPMM4i1WT0KuiaeSYRT7",
*     "description":"Default appClient for jaiminho",
*     "userId": 1,
*     "createdAt": "2015-11-23T16:50:22.064Z",
*     "updatedAt": "2015-11-23T16:50:22.064Z",
*     "deletedAt": null
*   }
*   "createdAt": "2015-11-23T16:50:22.064Z",
*   "updatedAt": "2015-11-23T16:50:22.064Z",
*   "deletedAt": null
* }
*
* @apiUse defaultResponses
*/
