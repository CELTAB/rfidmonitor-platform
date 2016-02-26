/**
* @api {delete} /api/collectors/:id 5. Remove a Collector
* @apiVersion 1.0.0
* @apiName DeleteCollector
* @apiGroup Collectors
* @apiPermission TokenAccess
*
* @apiDescription Collector are responsible for read RFID records from antennas and pass it to the server.
* Use this URI to remove a collector from database.
*
* @apiParam (Param) {Number} id ID of the collector.
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
*   {
*     "id": 1,
*     "name": "Collector updated",
*     "lat": "-25.436014",
*     "lng": "-54.597145",
*     "mac": "78:2b:cb:c0:75:24",
*     "description": "Collector description updated",
*     "createdAt": "2015-11-23T16:50:22.064Z",
*     "updatedAt": "2015-11-27T15:32:18.064Z",
*     "deletedAt": "2015-11-27T17:55:12.910Z",
*     "groupId": 1,
*     "status": "OFFLINE"
*   }
*
* @apiUse defaultResponses
*/
