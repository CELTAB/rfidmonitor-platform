/**
* @api {get} /api/rfiddatas 1. Get array of RFIDDatas
* @apiVersion 1.0.0
* @apiName GetRfidData
* @apiGroup RFIDData
* @apiPermission TokenAccess
*
* @apiDescription RFIDData records from collecting point, defined by collectors.
*
* @apiExample Example usage:
* https://localhost/api/rfiddatas
*
* @apiExample Query Example:
* https://localhost/api/rfiddatas?q={"where":{"rfidCode":"5555526"}, "limit":3, "include":[{"all":true}], "entity":"carro", "entityQuery":{"where":{"placa":"ABC-1234"}, "include":[{"all":true}]}}
*
* @apiExample Query Object example:
q={
  "where":{
    "rfidCode":"5555526"
  },
  "limit":3,
  "include":[{
    "all":true
  }],
  "entity":"carro",
  "embeddedRecords":true,
  "entityQuery":{
    "where":{
      "placa":"ABC-1234"
    },
    "include":[{
      "all":true
    }]
  }
}
*
* @apiSuccess {Object[]} groups       List of RFIDData records.
*
* @apiUse defaultQuery
* @apiParam entity (Inside "q" object) Search RFIDData linkin with this Dinamic entity. Mandatory if embeddedRecords is true.
* @apiParam entityQuery (Inside "q" object) Search for all entities that match query defined by entityQuery parameter. Also receives sequelize queries (See <a href="http://docs.sequelizejs.com/en/latest/docs/querying/" target="_blank"> here</a>).
* @apiParam embeddedRecords (Inside "q" object) For each found entity, based on entityQuery, it searcs the related rfid records to embed as an array.
*
* @apiSuccessExample Success-Response:
*HTTP/1.1 200 OK
[
  {
    "id": 1,
    "rfidCode": "5555526",
    "extraData": null,
    "rfidReadDate": "2015-11-23T16:50:22.819Z",
    "serverReceivedDate": "2015-11-23T16:50:26.850Z",
    "createdAt": "2015-11-23T16:50:26.853Z",
    "updatedAt": "2015-11-23T16:50:26.853Z",
    "deletedAt": null,
    "collectorId": 3,
    "packageId": 2
  },
  {
    "id": 2,
    "rfidCode": "5555522",
    "extraData": null,
    "rfidReadDate": "2015-11-23T16:50:22.821Z",
    "serverReceivedDate": "2015-11-23T16:50:26.852Z",
    "createdAt": "2015-11-23T16:50:26.854Z",
    "updatedAt": "2015-11-23T16:50:26.854Z",
    "deletedAt": null,
    "collectorId": 3,
    "packageId": 1
  }
]
*
@apiSuccessExample Response with Entity:
HTTP/1.1 200 OK
[
  {
    "id": 1,
    "rfidCode": "5555526",
    "extraData": null,
    "rfidReadDate": "2015-11-23T16:50:22.819Z",
    "serverReceivedDate": "2015-11-23T16:50:26.850Z",
    "createdAt": "2015-11-23T16:50:26.853Z",
    "updatedAt": "2015-11-23T16:50:26.853Z",
    "deletedAt": null,
    "collectorId": 3,
    "packageId": 2,
    "entity": {
      "id": 2,
      "placa": "ABC-1234",
      "chassi": "AS12345AJSD",
      "foto_platform_media": null,
      "pit": "5555526",
      "motorista_id": 1,
      "createdAt": "2015-12-04T19:09:03.206Z",
      "updatedAt": "2015-12-04T19:09:03.206Z",
      "deletedAt": null
    }
  }
]

@apiSuccessExample Response with Embedded Records:
HTTP/1.1 200 OK
{
    "id": 2,
    "placa": "ABC-1234",
    "chassi": "AS12345AJSD",
    "foto_platform_media": null,
    "pit": "5555526",
    "motorista_id": 1,
    "createdAt": "2015-12-04T19:09:03.206Z",
    "updatedAt": "2015-12-04T19:09:03.206Z",
    "deletedAt": null,
    "records": [
      {
        "id": 1,
        "rfidCode": "5555526",
        "extraData": null,
        "rfidReadDate": "2015-11-23T16:50:22.819Z",
        "serverReceivedDate": "2015-11-23T16:50:26.850Z",
        "createdAt": "2015-11-23T16:50:26.853Z",
        "updatedAt": "2015-11-23T16:50:26.853Z",
        "deletedAt": null,
        "collectorId": 3,
        "packageId": 2
      }
    ]
  }

@apiUse defaultResponses
*/


/*
Query example for seach RFIDData linkin with Dinamic entity
https://localhost:8143/api/rfiddatas?q={"where":{"rfidCode":"5555526"}, "limit":3, "include":[{"all":true}], "entity":"carro", "entityQuery":{"where":{"placa":"ABC-1234"}, "include":[{"all":true}]}}
Obj Query example:
q={
  "where":{
    "rfidCode":"5555526"
  },
  "limit":3,
  "include":[{
    "all":true
  }],
  "entity":"carro",
  "embeddedRecords":false,
  "entityQuery":{
    "where":{
      "placa":"ABC-1234"
    },
    "include":[{
      "all":true
    }]
  }
}
Accept all parameters defined by sequelize, and inside "entityQuery" it also receives sequelize queries.
Seach-flow:
  - when embeddedRecords is true: Search for all entities that match query defined by entityQuery parameter. And then for each found entity it searcs the related rfid records.
  - When embeddedRecords is false or null/undefined (not informed): Search for all RFIDDatas based on the query and then link with the given dinamic antity, filtering based on the query defined by entityQuery parameter.
*/

/*
With embeddedRecords been true the result object will be the entity with all related records embedded, like this:
{
    "id": 2,
    "placa": "ABC-1234",
    "chassi": "AS12345AJSD",
    "foto_platform_media": null,
    "pit": "5555526",
    "motorista_id": 1,
    "createdAt": "2015-12-04T19:09:03.206Z",
    "updatedAt": "2015-12-04T19:09:03.206Z",
    "deletedAt": null,
    "records": [
      {
        "id": 1,
        "rfidCode": "5555526",
        "extraData": null,
        "rfidReadDate": "2015-11-23T16:50:22.819Z",
        "serverReceivedDate": "2015-11-23T16:50:26.850Z",
        "createdAt": "2015-11-23T16:50:26.853Z",
        "updatedAt": "2015-11-23T16:50:26.853Z",
        "deletedAt": null,
        "collectorId": 3,
        "packageId": 2
      }
    ]
  }
PS.: With embeddedRecords been true, the 'entity' parameter is mandatory.

With embeddedRecords been false or null/undefined (not informed) the result object will be the record with the related entity embedded, like this:
{
    "id": 1,
    "rfidCode": "5555526",
    "extraData": null,
    "rfidReadDate": "2015-11-23T16:50:22.819Z",
    "serverReceivedDate": "2015-11-23T16:50:26.850Z",
    "createdAt": "2015-11-23T16:50:26.853Z",
    "updatedAt": "2015-11-23T16:50:26.853Z",
    "deletedAt": null,
    "collectorId": 3,
    "packageId": 2,
    "entity": {
      "id": 2,
      "placa": "ABC-1234",
      "chassi": "AS12345AJSD",
      "foto_platform_media": null,
      "pit": "5555526",
      "motorista_id": 1,
      "createdAt": "2015-12-04T19:09:03.206Z",
      "updatedAt": "2015-12-04T19:09:03.206Z",
      "deletedAt": null
    }
  }
PS.: This is the default behavior, when the entity parameter is informed.
*/

/*
Sequelize also allows you to order the result based on your definition.
By the fault the query with embeddedRecords true will give you the records ordered by rfidReadDate in Descendent way,
that means, the newest readed record will be shown first.

The sequelize order parameter to acomplish this:
order: [['rfidReadDate', 'DESC']]
To order in Ascendent way, use this:
order: [['rfidReadDate', 'ASC']]

Is also possible to chose any other field to order by. Just change the first element on the order array:
order: [['fieldName', 'ASC']]

PS.: The order is composed by an aray of arrays.
*/
