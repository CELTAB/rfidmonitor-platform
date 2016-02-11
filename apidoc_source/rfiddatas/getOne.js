/**
* @api {get} /api/rfiddatas/:id 2. Get only one RFID Record
* @apiVersion 1.0.0
* @apiName GetOneRfidData
* @apiGroup RFIDData
* @apiPermission TokenAccess
*
* @apiDescription RFIDData records from collecting point, defined by collectors.
*
* @apiParam (Param) {Number} id ID of the RFIDData record.
*
* @apiSuccess {Number} Id       RFIDData ID on database.
* @apiSuccess {String} rfidCode       RFID code.
* @apiSuccess {Date} rfidReadDate       Read date and time from collector.
* @apiSuccess {Date} serverReceivedDate       Server recived Date and time.
* @apiSuccess {Date} createdAt      Date time of creation record on database, defined by sequelize.
* @apiSuccess {Date} updatedAt       Last update of this RFIDData (same as createdAt, because it will never change).
* @apiSuccess {Date} deletedAt       Null if RFIDData is not deleted or removal date.
* @apiSuccess {Number} collectorId       ID of the collector.
* @apiSuccess {Number} packageId       ID of the package, used only by back-end.
* @apiSuccess {String} extraData       Any other information (Dynamic purpouses).
*
*
* @apiSuccessExample Success-Response:
*HTTP/1.1 200 OK
* {
*  "id": 1,
*  "rfidCode": "5555526",
*  "extraData": null,
*  "rfidReadDate": "2015-11-23T16:50:22.819Z",
*  "serverReceivedDate": "2015-11-23T16:50:26.850Z",
*  "createdAt": "2015-11-23T16:50:26.853Z",
*  "updatedAt": "2015-11-23T16:50:26.853Z",
*  "deletedAt": null,
*  "collectorId": 3,
*  "packageId": 2
*}
*
* @apiUse defaultResponses
*/
