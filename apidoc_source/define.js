/**
* @apiDefine TokenAccess The Client must have a token that allows it to get access on this resource.
*/

/**
* @apiDefine defaultQuery
* @apiParam q (Query) Received all parameter defined by Sequelize documentations. Available <a href="http://docs.sequelizejs.com/en/latest/docs/querying/" target="_blank"> here.</a>
*/

/**
* @apiDefine defaultResponses
* @apiError Unauthorized Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.
* @apiError Forbidden The client is authenticated but has not authorization on the requested resource.
* @apiError NotFound The required resource does not exist.
*
* @apiErrorExample UnauthorizedError:
* HTTP/1.1 401 Unauthorized
*	"Unauthorized"
*
* @apiErrorExample ForbiddenError:
* HTTP/1.1 403 Forbidden
* {
*   "message": "Token not allowed for this opperation",
*   "status": 403,
*   "error": "Get out dog."
* }
*
* @apiErrorExample ResponseError:
* HTTP/1.1 'Code & Message'
* {
*  "message": "Any Message here",
*  "status": 'code',
*  "error": "Detailed error here"
* }
*/
