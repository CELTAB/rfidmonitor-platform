/**
* @api {put} /api/appclients/:id 4. Update an existing AppClient
* @apiVersion 1.0.0
* @apiName PutAppClient
* @apiGroup AppClients
* @apiPermission TokenAccess
*
* @apiDescription AppClients who have a token and can access resources.
*
* @apiParam (Param) {Number} id ID of the AppClient.
*
* @apiParam (Body) {Number} ID   ID of the AppClient on database {Required}.
* @apiParam (Body) {String} description   Defines the AppClient, by a simple description {Required}.
* @apiParam (Body) {Number} userId   ID of User related to this AppClient {Required}.
*
* @apiExample Object Example:
  {
    "id": 1,
    "description": "Default appClient for admin, updated",
    "userId": 1
  }
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
  {
    "id": 1,
    "token": "uNgZnpGeKpr8JPMM4i1WT0KuiaeSYRT7",
    "description": "Default appClient for admin, updated",
    "createdAt": "2015-11-23T16:50:16.361Z",
    "updatedAt": "2015-12-16T11:45:24.829Z",
    "deletedAt": null,
    "userId": 1
  }
*
* @apiUse defaultResponses
*/
