/**
* @api {get} /api/count/rfiddatas 6. Get a count of RFIDDatas
* @apiVersion 1.0.0
* @apiName GetCountRfidData
* @apiGroup RFIDData
* @apiPermission TokenAccess
*
* @apiDescription Get only the total of RFIDData records by the given query
*
* @apiExample Example usage:
* https://localhost/api/count/rfiddatas
*
* @apiExample Query Example:
* https://localhost/api/count/rfiddatas?q={"where":{"rfidCode":"5555526"}}
*
* @apiSuccess {Object} total       Total count of RFIDData records.
*
* @apiUse defaultQuery
*
* @apiSuccessExample Success-Response:
*HTTP/1.1 200 OK
{
  "total": 504
}
*
@apiUse defaultResponses
*/
