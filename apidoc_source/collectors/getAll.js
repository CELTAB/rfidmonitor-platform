/**
* @api {get} /api/collectors 1. Get array of Collectors
* @apiVersion 1.0.0
* @apiName GetCollectors
* @apiGroup Collectors
* @apiPermission TokenAccess
*
* @apiDescription Collector are responsible for read RFID records from antennas and pass it to the server.
* Use this URI to search on platform for Collectors that match the given query or all the availables collectors.
*
* @apiExample Example usage:
* curl -i https://localhost/api/collectors
*
* @apiExample Query Example:
* curl -i https://localhost/api/collectors?q={"limit": 2, "dashboard": true}
*
* @apiSuccess {Object[]} collector       List of Collectors.
*
* @apiUse defaultQuery
* @apiParam dashboard (Inside "q" object) Returns number of records readed from the past year until now.
*
* @apiSuccessExample Success-Response:
*HTTP/1.1 200 OK
*{  count: 2,
*   rows: [
*   {
*     "id": 1,
*     "name": "Collector-Simulator1",
*     "lat": "-25.436014",
*     "lng": "-54.597145",
*     "mac": "78:2b:cb:c0:75:24",
*     "description": "Collector generated by Collector-Simulator",
*     "createdAt": "2015-11-23T16:50:22.064Z",
*     "updatedAt": "2015-11-23T16:50:22.064Z",
*     "deletedAt": null,
*     "groupId": 1,
*     "status": "OFFLINE",
*     "records": {
*       "year": 98,
*       "month": 98,
*       "week": 98,
*       "daily": 98,
*       "total": 98
*     }
*   },
*   {
*     "id": 2,
*     "name": "Collector-Simulator2",
*     "lat": "-25.436014",
*     "lng": "-54.597145",
*     "mac": "78:2b:cb:c0:75:86",
*     "description": "Collector generated by Collector-Simulator",
*     "createdAt": "2015-11-23T16:50:22.066Z",
*     "updatedAt": "2015-11-23T16:50:22.066Z",
*     "deletedAt": null,
*     "groupId": 1,
*     "status": "ONLINE",
*     "records": {
*       "year": 190,
*       "month": 98,
*       "week": 50,
*       "daily": 15,
*       "total": 210
*     }
*   }
* ]
*}
*
*
* @apiUse defaultResponses
*/
