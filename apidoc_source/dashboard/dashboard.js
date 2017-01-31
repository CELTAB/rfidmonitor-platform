/**
* @api {get} /api/dashboard 1. Get statistical info to build dashboards
* @apiVersion 1.0.0
* @apiName GetDashboard
* @apiGroup Dashboard
* @apiPermission TokenAccess
*
* @apiDescription Statistical data summarized by collectors.
*
*
* @apiSuccess {Number} count       Number of collectors.
* @apiSuccess {Object[]} rows       Array of statistical data by collector.
* @apiSuccess {Object[]} rows.records       Statistical data.
* @apiSuccess {Number} rows.records.year       Quantity of rfiddata in the last year (last 12 months).
* @apiSuccess {Number} rows.records.month       Quantity of rfiddata in the last month.
* @apiSuccess {Number} rows.records.week       Quantity of rfiddata in the last week.
* @apiSuccess {Number} rows.records.daily       Quantity of rfiddata in the last day (last 24 hours).
* @apiSuccess {Object} rows.records.lastYear       Quantity of rfiddata in the last year, grouped by month (last 12 months).
* @apiSuccess {Number} rows.records.lastYear.01-2017      Quantity of rfiddata by month.
* @apiSuccess {Object} rows.records.total       Total number of rfiddata.
* @apiSuccess {Object} rows.collector-fields       Collector's fields: id, name, lat, lng, mac, ...
*
*
* @apiSuccessExample Success-Response:
*HTTP/1.1 200 OK
{
  "count": 2,
  "rows": [
    {
      "id": 1,
      "name": "A",
      "lat": "-25.436014",
      "lng": "-54.597145",
      "mac": "B8:27:EB:21:28:B8",
      "description": null,
      "deletedAt": null,
      "createdAt": "2017-01-26T18:43:19.179Z",
      "updatedAt": "2017-01-26T18:43:58.044Z",
      "groupId": 1,
      "status": "OFFLINE",
      "records": {
        "year": 80,
        "month": 6,
        "week": 0,
        "daily": 0,
        "lastYear": {
          "2-2016": 0,
          "3-2016": 0,
          "4-2016": 0,
          "5-2016": 0,
          "6-2016": 0,
          "7-2016": 0,
          "8-2016": 7,
          "9-2016": 26,
          "10-2016": 0,
          "11-2016": 0,
          "12-2016": 41,
          "1-2017": 6
        },
        "total": 80
      }
    },
    {
      "id": 2,
      "name": "B",
      "lat": "-25.436025",
      "lng": "-54.597145",
      "mac": "B8:27:EB:21:28:B7",
      "description": null,
      "deletedAt": null,
      "createdAt": "2017-01-26T18:43:19.183Z",
      "updatedAt": "2017-01-26T18:44:02.031Z",
      "groupId": 1,
      "status": "OFFLINE",
      "records": {
        "year": 962,
        "month": 12,
        "week": 9,
        "daily": 0,
        "lastYear": {
          "2-2016": 0,
          "3-2016": 67,
          "4-2016": 60,
          "5-2016": 10,
          "6-2016": 275,
          "7-2016": 0,
          "8-2016": 166,
          "9-2016": 368,
          "10-2016": 4,
          "11-2016": 0,
          "12-2016": 0,
          "1-2017": 12
        },
        "total": 962
      }
    }
  ]
}
*
* @apiUse defaultResponses
*/
