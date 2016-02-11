/**
* @api {post} /api/appclients 3. Create a new AppClient
* @apiVersion 1.0.0
* @apiName PostAppClient
* @apiGroup AppClients
* @apiPermission TokenAccess
*
* @apiDescription AppClients who have a token and can access resources.
*
* @apiExample Object Example:
  {
    "description": "Description for this appClient",
    "userId": 1
  }
*
* @apiParam (Body) {String} description   Defines the AppClient, by a simple description {Required}.
* @apiParam (Body) {Number} userId   ID of User related to this AppClient {Required}.
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
{
  "id": 4,
  "description": "Description for this appClient",
  "userId": 1,
  "token": "HGdWW1BLAVSc84lBfbMPe79gq9T46ZaL",
  "updatedAt": "2015-12-15T13:06:41.834Z",
  "createdAt": "2015-12-15T13:06:41.834Z",
  "deletedAt": null
}

* @apiUse defaultResponses
*/
