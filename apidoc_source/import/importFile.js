/**
* @api {post} /api/import 1. Import a Rfiddata json file.
* @apiVersion 1.0.0
* @apiName ImportRfiddata
* @apiGroup Import
* @apiPermission TokenAccess
*
* @apiDescription Import a json file containing rfiddata registers. Normally exported from a collector.
*
* @apiParam (Body) {File} rfidimport The json file to be imported {Required}.
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
{
  "receivedPackages": 2,
  "processedPackages": 2,
  "receivedRfids": 4,
  "insertedPackages": 1,
  "insertedRfids": 3,
  "discardedByRepetitionPackagesNumber": 1,
  "discardedByRepetitionPackagesList": ["packet-hash"],
  "discardedByErrorPackagesNumber": 0,
  "discardedByErrorPackagesList": null
}
*
* @apiUse defaultResponses
*/
