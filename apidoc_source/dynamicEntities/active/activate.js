/**
@api {put} /api/dynamic/:entity 7. Activate a Dynamic Entity
@apiVersion 1.0.0
@apiName ActivateEntity
@apiGroup DynamicEntity
@apiPermission TokenAccess

@apiDescription Activates an inactive entity. Is allowed use only activated entities.

* @apiExample Example usage:
* https://localhost/api/dynamic/driver

* @apiParam (Param) {String} entity Name (identifier) of the Dynami Entity.

* @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
"OK"

*/
