/**
* @api {post} /api/route 3. Create a new UriRoute
* @apiVersion 1.0.0
* @apiName PostRoute
* @apiGroup Routes
* @apiPermission TokenAccess
*
* @apiDescription You are not allowed to make any change on UriRoutes.
*
*
@apiErrorExample ForbiddenError:
HTTP/1.1 403 Forbidden
{
 "message": "You are not allowed to make any change on UriRoutes",
 "status": 403,
 "error": "Not Allowed"
}
*/


/**
* @api {put} /api/route/:id 4. Update an existing UriRoute
* @apiVersion 1.0.0
* @apiName PutRoute
* @apiGroup Routes
* @apiPermission TokenAccess
*
* @apiDescription You are not allowed to make any change on UriRoutes.
*
*
@apiErrorExample ForbiddenError:
HTTP/1.1 403 Forbidden
{
 "message": "You are not allowed to make any change on UriRoutes",
 "status": 403,
 "error": "Not Allowed"
}
*/

/**
* @api {delete} /api/routes/:id 5. Remove an existing UriRoute
* @apiVersion 1.0.0
* @apiName DeleteRoute
* @apiGroup Routes
* @apiPermission TokenAccess
*
* @apiDescription You are not allowed to make any change on UriRoutes.
*
*
@apiErrorExample ForbiddenError:
HTTP/1.1 403 Forbidden
{
 "message": "You are not allowed to make any change on UriRoutes",
 "status": 403,
 "error": "Not Allowed"
}
*/
