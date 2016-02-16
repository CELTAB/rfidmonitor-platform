/**
* @api {post} /api/media 2. Create a new Media
* @apiVersion 1.0.0
* @apiName PostMedia
* @apiGroup Media
* @apiPermission TokenAccess
*
* @apiDescription Insert a new Media and create a uuid to identify it.
*
* @apiParam (Body) {File} image The Media/Image to be persist {Required}.
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
{
  "mediaId": "b2A76jPf2A1dWSvW0ceiL72pLxvIwZMjC9JGQ7c94XGB2DFmZVeaEa9RVaQsY222"
}
*
* @apiUse defaultResponses
*/
