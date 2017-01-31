/**
@api {delete} /api/dynamic/:entity 6. Deactivate a Dynamic Entity
@apiVersion 1.0.0
@apiName DeactivateEntity
@apiGroup DynamicEntity
@apiPermission TokenAccess

@apiDescription Deactivates an active entity. Is allowed use only activated entities.

* @apiExample Example usage:
* https://localhost/api/dynamic/driver

* @apiParam (Param) {String} entity Name (identifier) of the Dynamic Entity.

* @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
"OK"
*/
