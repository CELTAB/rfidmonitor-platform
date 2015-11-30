/**
* @api {put} /api/collectors/:id 4. Update an existing Collector
* @apiVersion 1.0.0
* @apiName PutCollector
* @apiGroup Collectors
* @apiPermission TokenAccess
*
* @apiDescription Collector are responsible for read RFID records from antennas and pass it to the server.
* Use this URI to update a collector from database.
*
* @apiParam (Param) {Number} id ID of the collector.
*
* @apiParam (Body) {Number} groupId Group ID the collector is related {Required}.
* @apiParam (Body) {String} name Name of the Collector {Required, Unique}.
* @apiParam (Body) {String} lat   Geolocation of the Collector - Latitude.
* @apiParam (Body) {String} lng   Geolocation of the Collector - Longitude.
* @apiParam (Body) {String} mac MAC address of the Collector {Required, Unique}.
* @apiParam (Body) {String} description   Brief description to describe the Collector.
*
* @apiExample Object Example:
*   {
*     "id": 1,
*     "name": "Collector updated",
*     "lat": "-25.436014",
*     "lng": "-54.597145",
*     "mac": "78:2b:cb:c0:75:24",
*     "description": "Collector description updated",
*     "createdAt": "2015-11-23T16:50:22.064Z",
*     "updatedAt": "2015-11-23T16:50:22.064Z",
*     "deletedAt": null,
*     "groupId": 1,
*   }
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
*     "deletedAt": null,
*     "groupId": 1,
*     "status": "OFFLINE"
*   }
*
* @apiUse defaultResponses
*/
