/**
* @api {get} /api/appclients 1. Get array of AppClients
* @apiVersion 1.0.0
* @apiName GetAppClients
* @apiGroup AppClients
* @apiPermission TokenAccess
*
* @apiDescription AppClients who have a token and can access resources.
*
* @apiExample Example usage:
* https://localhost/api/appclients
*
* @apiExample Query Example:
* https://localhost/api/appclients?q={"limit": 2, "include":[{"all":true}]}
*
* @apiSuccess {Object[]} appclients       List of AppClients.
*
* @apiUse defaultQuery
*
* @apiSuccessExample Success-Response:
*HTTP/1.1 200 OK
{
    count: 2,
    rows: [
      {
        "id": 1,
        "token": "uNgZnpGeKpr8JPMM4i1WT0KuiaeSYRT7",
        "description": "Default appClient for admin",
        "createdAt": "2015-11-23T16:50:16.361Z",
        "updatedAt": "2015-11-23T16:50:16.361Z",
        "deletedAt": null,
        "userId": 2
      },
      {
        "id": 2,
        "token": "XOdWlEcXZD54SMnHyWJyOego2KSdpIRK",
        "description": "Default appClient for jaiminho",
        "createdAt": "2015-11-25T12:06:57.660Z",
        "updatedAt": "2015-11-25T12:06:57.660Z",
        "deletedAt": null,
        "userId": 1
      }
    ]
}

*
* @apiUse defaultResponses
*/
