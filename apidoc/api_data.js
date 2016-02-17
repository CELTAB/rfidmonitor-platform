define({ "api": [
  {
    "type": "delete",
    "url": "/api/appclients/:id",
    "title": "5. Remove an AppClient",
    "version": "1.0.0",
    "name": "DeleteAppClient",
    "group": "AppClients",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>AppClients who have a token and can access resources.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the AppClient.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"id\": 3,\n    \"token\": \"MACcN1GgtCXw3tyQqd1QkrT3GhwsWM4y\",\n    \"description\": \"Default appClient for jaiminho\",\n    \"createdAt\": \"2015-11-30T19:51:39.303Z\",\n    \"updatedAt\": \"2015-11-30T19:51:39.303Z\",\n    \"deletedAt\": \"2015-12-16T11:47:53.215Z\",\n    \"userId\": 3\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/appClients/deleteAppClient.js",
    "groupTitle": "AppClients",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/appclients",
    "title": "1. Get array of AppClients",
    "version": "1.0.0",
    "name": "GetAppClients",
    "group": "AppClients",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>AppClients who have a token and can access resources.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "https://localhost/api/appclients",
        "type": "json"
      },
      {
        "title": "Query Example:",
        "content": "https://localhost/api/appclients?q={\"limit\": 2, \"include\":[{\"all\":true}]}",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "appclients",
            "description": "<p>List of AppClients.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"id\": 1,\n    \"token\": \"uNgZnpGeKpr8JPMM4i1WT0KuiaeSYRT7\",\n    \"description\": \"Default appClient for admin\",\n    \"createdAt\": \"2015-11-23T16:50:16.361Z\",\n    \"updatedAt\": \"2015-11-23T16:50:16.361Z\",\n    \"deletedAt\": null,\n    \"userId\": 2\n  },\n  {\n    \"id\": 2,\n    \"token\": \"XOdWlEcXZD54SMnHyWJyOego2KSdpIRK\",\n    \"description\": \"Default appClient for jaiminho\",\n    \"createdAt\": \"2015-11-25T12:06:57.660Z\",\n    \"updatedAt\": \"2015-11-25T12:06:57.660Z\",\n    \"deletedAt\": null,\n    \"userId\": 1\n  }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/appClients/getAll.js",
    "groupTitle": "AppClients",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "q",
            "description": "<p>(Query) Received all parameter defined by Sequelize documentations. Available <a href=\"http://docs.sequelizejs.com/en/latest/docs/querying/\" target=\"_blank\"> here.</a></p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/appclients/:id",
    "title": "2. Get only one AppClient",
    "version": "1.0.0",
    "name": "GetOneAppClient",
    "group": "AppClients",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>AppClients who have a token and can access resources.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the AppClient.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "Id",
            "description": "<p>AppClient ID on database.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "token",
            "description": "<p>Token that give access to resources.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "description",
            "description": "<p>Defines the AppClient.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Creation date generated by Sequelize.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>Last update of this AppClient.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "deletedAt",
            "description": "<p>Null if appClient is not deleted or removal date.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "userId",
            "description": "<p>ID of User related to this AppClient.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 1,\n  \"token\": \"uNgZnpGeKpr8JPMM4i1WT0KuiaeSYRT7\",\n  \"description\": \"Default appClient for admin\",\n  \"createdAt\": \"2015-11-23T16:50:16.361Z\",\n  \"updatedAt\": \"2015-11-23T16:50:16.361Z\",\n  \"deletedAt\": null,\n  \"userId\": 1\n}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/appClients/getOne.js",
    "groupTitle": "AppClients",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/appclients",
    "title": "3. Create a new AppClient",
    "version": "1.0.0",
    "name": "PostAppClient",
    "group": "AppClients",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>AppClients who have a token and can access resources.</p> ",
    "examples": [
      {
        "title": "Object Example:",
        "content": "{\n  \"description\": \"Description for this appClient\",\n  \"userId\": 1\n}",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "description",
            "description": "<p>Defines the AppClient, by a simple description {Required}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "userId",
            "description": "<p>ID of User related to this AppClient {Required}.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 4,\n  \"description\": \"Description for this appClient\",\n  \"userId\": 1,\n  \"token\": \"HGdWW1BLAVSc84lBfbMPe79gq9T46ZaL\",\n  \"updatedAt\": \"2015-12-15T13:06:41.834Z\",\n  \"createdAt\": \"2015-12-15T13:06:41.834Z\",\n  \"deletedAt\": null\n}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/appClients/newAppClient.js",
    "groupTitle": "AppClients",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/api/appclients/:id",
    "title": "4. Update an existing AppClient",
    "version": "1.0.0",
    "name": "PutAppClient",
    "group": "AppClients",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>AppClients who have a token and can access resources.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the AppClient.</p> "
          }
        ],
        "Body": [
          {
            "group": "Body",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "ID",
            "description": "<p>ID of the AppClient on database {Required}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "description",
            "description": "<p>Defines the AppClient, by a simple description {Required}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "userId",
            "description": "<p>ID of User related to this AppClient {Required}.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Object Example:",
        "content": "{\n  \"id\": 1,\n  \"description\": \"Default appClient for admin, updated\",\n  \"userId\": 1\n}",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"id\": 1,\n    \"token\": \"uNgZnpGeKpr8JPMM4i1WT0KuiaeSYRT7\",\n    \"description\": \"Default appClient for admin, updated\",\n    \"createdAt\": \"2015-11-23T16:50:16.361Z\",\n    \"updatedAt\": \"2015-12-16T11:45:24.829Z\",\n    \"deletedAt\": null,\n    \"userId\": 1\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/appClients/updateAppClient.js",
    "groupTitle": "AppClients",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/api/collectors/:id",
    "title": "5. Remove a Collector",
    "version": "1.0.0",
    "name": "DeleteCollector",
    "group": "Collectors",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Collector are responsible for read RFID records from antennas and pass it to the server. Use this URI to remove a collector from database.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the collector.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"id\": 1,\n    \"name\": \"Collector updated\",\n    \"lat\": \"-25.436014\",\n    \"lng\": \"-54.597145\",\n    \"mac\": \"78:2b:cb:c0:75:24\",\n    \"description\": \"Collector description updated\",\n    \"createdAt\": \"2015-11-23T16:50:22.064Z\",\n    \"updatedAt\": \"2015-11-27T15:32:18.064Z\",\n    \"deletedAt\": \"2015-11-27T17:55:12.910Z\",\n    \"groupId\": 1,\n    \"status\": \"OFFLINE\"\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/collectors/deleteCollector.js",
    "groupTitle": "Collectors",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/collectors",
    "title": "1. Get array of Collectors",
    "version": "1.0.0",
    "name": "GetCollectors",
    "group": "Collectors",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Collector are responsible for read RFID records from antennas and pass it to the server. Use this URI to search on platform for Collectors that match the given query or all the availables collectors.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://localhost/api/collectors",
        "type": "json"
      },
      {
        "title": "Query Example:",
        "content": "curl -i https://localhost/api/collectors?q={\"limit\": 2}",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "collector",
            "description": "<p>List of Collectors.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"id\": 1,\n    \"name\": \"Collector-Simulator1\",\n    \"lat\": \"-25.436014\",\n    \"lng\": \"-54.597145\",\n    \"mac\": \"78:2b:cb:c0:75:24\",\n    \"description\": \"Collector generated by Collector-Simulator\",\n    \"createdAt\": \"2015-11-23T16:50:22.064Z\",\n    \"updatedAt\": \"2015-11-23T16:50:22.064Z\",\n    \"deletedAt\": null,\n    \"groupId\": 1,\n    \"status\": \"OFFLINE\"\n  },\n  {\n    \"id\": 2,\n    \"name\": \"Collector-Simulator2\",\n    \"lat\": \"-25.436014\",\n    \"lng\": \"-54.597145\",\n    \"mac\": \"78:2b:cb:c0:75:86\",\n    \"description\": \"Collector generated by Collector-Simulator\",\n    \"createdAt\": \"2015-11-23T16:50:22.066Z\",\n    \"updatedAt\": \"2015-11-23T16:50:22.066Z\",\n    \"deletedAt\": null,\n    \"groupId\": 1,\n    \"status\": \"ONLINE\"\n  }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/collectors/getAll.js",
    "groupTitle": "Collectors",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "q",
            "description": "<p>(Query) Received all parameter defined by Sequelize documentations. Available <a href=\"http://docs.sequelizejs.com/en/latest/docs/querying/\" target=\"_blank\"> here.</a></p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/collectors/:id",
    "title": "2. Get only one Collector",
    "version": "1.0.0",
    "name": "GetOneCollector",
    "group": "Collectors",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Collector are responsible for read RFID records from antennas and pass it to the server. Use this URI to search on platform for one Collector that match the given ID.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the collector.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "Id",
            "description": "<p>Collector ID on database.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "lat",
            "description": "<p>Coordinate of the collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "lng",
            "description": "<p>Coordinate of the collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "mac",
            "description": "<p>Macaddrass from the collector's hardware.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "description",
            "description": "<p>Defines the collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Creation date generated by Sequelize.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>Last update of this collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "deletedAt",
            "description": "<p>Null if collector is not deleted or removal date.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "groupId",
            "description": "<p>ID of related group.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "status",
            "description": "<p>Status ONLINE or OFFLINE.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"id\": 1,\n    \"name\": \"Collector-Simulator1\",\n    \"lat\": \"-25.436014\",\n    \"lng\": \"-54.597145\",\n    \"mac\": \"78:2b:cb:c0:75:24\",\n    \"description\": \"Collector generated by Collector-Simulator\",\n    \"createdAt\": \"2015-11-23T16:50:22.064Z\",\n    \"updatedAt\": \"2015-11-23T16:50:22.064Z\",\n    \"deletedAt\": null,\n    \"groupId\": 1,\n    \"status\": \"ONLINE\"\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/collectors/getOne.js",
    "groupTitle": "Collectors",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/collectors",
    "title": "3. Create a new Collector",
    "version": "1.0.0",
    "name": "PostCollector",
    "group": "Collectors",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Collector are responsible for read RFID records from antennas and pass it to the server. Use this URI to insert a new collector.</p> ",
    "examples": [
      {
        "title": "Object Example:",
        "content": "{\n  \"name\": \"Collector-Simulator1\",\n  \"lat\": \"-25.436014\",\n  \"lng\": \"-54.597145\",\n  \"mac\": \"78:2b:cb:c0:75:24\",\n  \"description\": \"Collector generated by Collector-Simulator\",\n  \"groupId\": 1\n}",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "groupId",
            "description": "<p>Group ID the collector is related {Required}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the Collector {Required, Unique}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "lat",
            "description": "<p>Geolocation of the Collector - Latitude.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "lng",
            "description": "<p>Geolocation of the Collector - Longitude.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "mac",
            "description": "<p>MAC address of the Collector {Required, Unique}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "description",
            "description": "<p>Brief description to describe the Collector.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"id\": 1,\n    \"name\": \"Collector-Simulator1\",\n    \"lat\": \"-25.436014\",\n    \"lng\": \"-54.597145\",\n    \"mac\": \"78:2b:cb:c0:75:24\",\n    \"description\": \"Collector generated by Collector-Simulator\",\n    \"createdAt\": \"2015-11-23T16:50:22.064Z\",\n    \"updatedAt\": \"2015-11-23T16:50:22.064Z\",\n    \"deletedAt\": null,\n    \"groupId\": 1,\n    \"status\": \"OFFLINE\"\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/collectors/newCollector.js",
    "groupTitle": "Collectors",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/api/collectors/:id",
    "title": "4. Update an existing Collector",
    "version": "1.0.0",
    "name": "PutCollector",
    "group": "Collectors",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Collector are responsible for read RFID records from antennas and pass it to the server. Use this URI to update a collector from database.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the collector.</p> "
          }
        ],
        "Body": [
          {
            "group": "Body",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "groupId",
            "description": "<p>Group ID the collector is related {Required}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the Collector {Required, Unique}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "lat",
            "description": "<p>Geolocation of the Collector - Latitude.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "lng",
            "description": "<p>Geolocation of the Collector - Longitude.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "mac",
            "description": "<p>MAC address of the Collector {Required, Unique}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "description",
            "description": "<p>Brief description to describe the Collector.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Object Example:",
        "content": "{\n  \"id\": 1,\n  \"name\": \"Collector updated\",\n  \"lat\": \"-25.436014\",\n  \"lng\": \"-54.597145\",\n  \"mac\": \"78:2b:cb:c0:75:24\",\n  \"description\": \"Collector description updated\",\n  \"createdAt\": \"2015-11-23T16:50:22.064Z\",\n  \"updatedAt\": \"2015-11-23T16:50:22.064Z\",\n  \"deletedAt\": null,\n  \"groupId\": 1,\n}",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"id\": 1,\n    \"name\": \"Collector updated\",\n    \"lat\": \"-25.436014\",\n    \"lng\": \"-54.597145\",\n    \"mac\": \"78:2b:cb:c0:75:24\",\n    \"description\": \"Collector description updated\",\n    \"createdAt\": \"2015-11-23T16:50:22.064Z\",\n    \"updatedAt\": \"2015-11-27T15:32:18.064Z\",\n    \"deletedAt\": null,\n    \"groupId\": 1,\n    \"status\": \"OFFLINE\"\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/collectors/updateCollector.js",
    "groupTitle": "Collectors",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/api/de/activate/:entity",
    "title": "7. Activate a Dynamic Entity",
    "version": "1.0.0",
    "name": "ActivateEntity",
    "group": "DynamicEntity",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Activates an inactive entity. Is allowed use only activated entities.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "https://localhost/api/de/deactivate/driver",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "entity",
            "description": "<p>Name (identifier) of the Dynami Entity.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\"OK\"",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/dynamicEntities/active/activate.js",
    "groupTitle": "DynamicEntity"
  },
  {
    "type": "put",
    "url": "/api/de/deactivate/:entity",
    "title": "6. Deactivate a Dynamic Entity",
    "version": "1.0.0",
    "name": "DeactivateEntity",
    "group": "DynamicEntity",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Deactivates an active entity. Is allowed use only activated entities.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "https://localhost/api/de/activate/driver",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "entity",
            "description": "<p>Name (identifier) of the Dynami Entity.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\"OK\"",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/dynamicEntities/active/deactivate.js",
    "groupTitle": "DynamicEntity"
  },
  {
    "type": "get",
    "url": "/api/de/meta",
    "title": "4. Get array of Meta informations",
    "version": "1.0.0",
    "name": "GetMeta",
    "group": "DynamicEntity",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Group of meta informations used to define each dynamic entity.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "https://localhost/api/de/meta",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "meta",
            "description": "<p>Meta Informations.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"field\": \"Driver\",\n    \"type\": \"ENTITY\",\n    \"unique\": [],\n    \"defaultReference\": \"full_name\",\n    \"structureList\": [\n      {\n        \"field\": \"Full Name\",\n        \"type\": \"TEXT\",\n        \"description\": \"Any description here\",\n        \"allowNull\": false,\n        \"identifier\": \"full_name\",\n        \"name\": \"full_name\"\n      },\n      {\n        \"field\": \"Age\",\n        \"type\": \"INTEGER\",\n        \"description\": \"Any description here\",\n        \"allowNull\": false,\n        \"identifier\": \"age\",\n        \"name\": \"age\"\n      }\n    ],\n    \"identifier\": \"driver\"\n  },\n  {\n    \"field\": \"Car\",\n    \"type\": \"ENTITY\",\n    \"unique\": [\n      [\n        \"rfid_code\"\n      ]\n    ],\n    \"defaultReference\": \"plate\",\n    \"structureList\": [\n      {\n        \"field\": \"RFID Code\",\n        \"type\": \"RFIDCODE\",\n        \"description\": \"Any description here\",\n        \"allowNull\": false,\n        \"identifier\": \"rfid_code\",\n        \"name\": \"rfid_code\"\n      },\n      {\n        \"field\": \"Plate\",\n        \"type\": \"TEXT\",\n        \"description\": \"Any description here\",\n        \"allowNull\": false,\n        \"identifier\": \"plate\",\n        \"name\": \"plate\"\n      },\n      {\n        \"field\": \"Manufacture Year\",\n        \"type\": \"DATETIME\",\n        \"description\": \"Any description here\",\n        \"allowNull\": false,\n        \"identifier\": \"manufacture_year\",\n        \"name\": \"manufacture_year\"\n      },\n      {\n        \"field\": \"Driver\",\n        \"type\": \"ENTITY\",\n        \"defaultReference\": \"full_name\",\n        \"identifier\": \"driver_id\",\n        \"name\": \"driver\"\n      }\n    ],\n    \"identifier\": \"car\"\n  }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/dynamicEntities/meta/getAllMetas.js",
    "groupTitle": "DynamicEntity",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/de/original/:entity",
    "title": "5. Get one Meta information",
    "version": "1.0.0",
    "name": "GetOneMeta",
    "group": "DynamicEntity",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Given an entity name, return the meta informatation used to define this dynamic entity.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "entity",
            "description": "<p>Name (identifier) of the Dynami Entity.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"field\": \"Driver\",\n  \"type\": \"ENTITY\",\n  \"unique\": [],\n  \"defaultReference\": \"full_name\",\n  \"structureList\": [\n    {\n      \"field\": \"Full Name\",\n      \"type\": \"TEXT\",\n      \"description\": \"Any description here\",\n      \"allowNull\": false,\n      \"identifier\": \"full_name\",\n      \"name\": \"full_name\"\n    },\n    {\n      \"field\": \"Age\",\n      \"type\": \"INTEGER\",\n      \"description\": \"Any description here\",\n      \"allowNull\": false,\n      \"identifier\": \"age\",\n      \"name\": \"age\"\n    }\n  ],\n  \"identifier\": \"driver\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/dynamicEntities/meta/getOneMeta.js",
    "groupTitle": "DynamicEntity",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/de/original/:entity",
    "title": "3. Get one Original definition",
    "version": "1.0.0",
    "name": "GetOneOriginal",
    "group": "DynamicEntity",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Given an entity name, return the original definitions used to create this dynamic entity.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "entity",
            "description": "<p>Name (identifier) of the Dynami Entity.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"field\": \"Driver\",\n  \"type\": \"ENTITY\",\n  \"unique\": [],\n  \"defaultReference\": \"full_name\",\n  \"structureList\": [\n    {\n      \"field\": \"Full Name\",\n      \"type\": \"TEXT\",\n      \"description\": \"Any description here\",\n      \"allowNull\": false,\n      \"identifier\": \"full_name\"\n    },\n    {\n      \"field\": \"Age\",\n      \"type\": \"INTEGER\",\n      \"description\": \"Any description here\",\n      \"allowNull\": false,\n      \"identifier\": \"age\"\n    }\n  ],\n  \"identifier\": \"driver\",\n  \"active\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/dynamicEntities/original/getOneOriginal.js",
    "groupTitle": "DynamicEntity",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/de/original",
    "title": "2. Get array of Original definitions",
    "version": "1.0.0",
    "name": "GetOriginals",
    "group": "DynamicEntity",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Group of original definitions used to create each dynamic entity.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "https://localhost/api/de/original",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "original",
            "description": "<p>Original definitions.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"field\": \"Driver\",\n    \"type\": \"ENTITY\",\n    \"unique\": [],\n    \"defaultReference\": \"full_name\",\n    \"structureList\": [\n      {\n        \"field\": \"Full Name\",\n        \"type\": \"TEXT\",\n        \"description\": \"Any description here\",\n        \"allowNull\": false,\n        \"identifier\": \"full_name\"\n      },\n      {\n        \"field\": \"Age\",\n        \"type\": \"INTEGER\",\n        \"description\": \"Any description here\",\n        \"allowNull\": false,\n        \"identifier\": \"age\"\n      }\n    ],\n    \"identifier\": \"driver\",\n    \"active\": true\n  },\n  {\n    \"field\": \"Car\",\n    \"type\": \"ENTITY\",\n    \"unique\": [\n      [\n        \"rfid_code\"\n      ]\n    ],\n    \"defaultReference\": \"plate\",\n    \"structureList\": [\n      {\n        \"field\": \"RFID Code\",\n        \"type\": \"RFIDCODE\",\n        \"description\": \"Any description here\",\n        \"allowNull\": false,\n        \"identifier\": \"rfid_code\"\n      },\n      {\n        \"field\": \"Plate\",\n        \"type\": \"TEXT\",\n        \"description\": \"Any description here\",\n        \"allowNull\": false,\n        \"identifier\": \"plate\"\n      },\n      {\n        \"field\": \"Manufacture Year\",\n        \"type\": \"DATETIME\",\n        \"description\": \"Any description here\",\n        \"allowNull\": false,\n        \"identifier\": \"manufacture_year\"\n      },\n      {\n        \"field\": \"Driver\",\n        \"type\": \"ENTITY\",\n        \"defaultReference\": \"full_name\",\n        \"identifier\": \"driver\"\n      }\n    ],\n    \"identifier\": \"car\",\n    \"active\": true\n  }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/dynamicEntities/original/getAllOriginals.js",
    "groupTitle": "DynamicEntity",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/de/register",
    "title": "1. Create a new Dynamic Entity",
    "version": "1.0.0",
    "name": "PostDynamicEntity",
    "group": "DynamicEntity",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Dynamic Entities to related object with monitored RFID.</p> ",
    "examples": [
      {
        "title": "Object Example:",
        "content": "[\n  {\n      \"field\" : \"Car\",\n      \"type\" : \"ENTITY\",\n      \"unique\" : [[\"RFID Code\"]],\n      \"defaultReference\":\"Plate\",\n      \"structureList\" : [\n          {\n              \"field\" : \"RFID Code\",\n              \"type\" : \"RFIDCODE\",\n              \"description\" : \"Any description here\",\n              \"allowNull\" : false\n          },\n          {\n              \"field\" : \"Plate\",\n              \"type\" : \"TEXT\",\n              \"description\" : \"Any description here\",\n              \"allowNull\" : false\n          },\n          {\n              \"field\" : \"Manufacture Year\",\n              \"type\" : \"DATETIME\",\n              \"description\" : \"Any description here\",\n              \"allowNull\" : false\n          },\n          {\n              \"field\" : \"Driver\",\n              \"type\" : \"ENTITY\",\n              \"unique\" : [],\n              \"defaultReference\":\"Full Name\",\n              \"structureList\" : [\n                  {\n                      \"field\" : \"Full Name\",\n                      \"type\" : \"TEXT\",\n                      \"description\" : \"Any description here\",\n                      \"allowNull\" : false\n                  },\n                  {\n                      \"field\" : \"Age\",\n                      \"type\" : \"INTEGER\",\n                      \"description\" : \"Any description here\",\n                      \"allowNull\" : false\n                  }\n              ]\n          }\n      ]\n  }\n]",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "field",
            "description": "<p>Defines the name for the Dynamic Entity, must be an unique name {Required, Unique}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "type",
            "description": "<p>Defines the type of the data field. Follows pre-defined types {Required}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "unique",
            "description": "<p>Describe the field(s) that must have unique values {Required}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "defaultReference",
            "description": "<p>Same name of the field used to reference this entity. Only alllowed for fields with type ENTITY {Required}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "structureList",
            "description": "<p>Defines a sub-entity with the same fields described here. Only alllowed for fields with type ENTITY {Required}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "description",
            "description": "<p>A short description for the given field. Used only for field with type different of ENTITY.</p> "
          },
          {
            "group": "Body",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "allowNull",
            "description": "<p>Defines if wheather the field accepts null values. Used only for field with type different of ENTITY {Required}.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Types Example",
          "content": "ENTITY: \"Used to create a new data type\"\nRFIDCODE: \"Relate the field with the RDIDData entity\"\nTEXT: \"Create a fiel that accept only text values (strings)\"\nDATETIME: \"Field to store a timestamp\"\nINTEGER: \"Field to store an integer value\"\nGROUP: \"Relate the field with the Group entity\"",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"OK\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/dynamicEntities/newEntity.js",
    "groupTitle": "DynamicEntity",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/api/de/dao/:entity/:id",
    "title": "5. Remove a Record",
    "version": "1.0.0",
    "name": "DeleteRecord",
    "group": "DynamicRecords",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Delete an existing record from a dynamic entity table, given its ID.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "entity",
            "description": "<p>Dynamic entity name.</p> "
          },
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the user.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"id\": 1,\n    \"full_name\": \"Jaime themailman\",\n    \"age\": 57,\n    \"createdAt\": \"2016-02-16T13:44:47.225Z\",\n    \"updatedAt\": \"2016-02-16T13:44:47.225Z\",\n    \"deletedAt\": \"2016-02-16T15:38:25.424Z\"\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/dynamicDao/delete.js",
    "groupTitle": "DynamicRecords",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/de/dao/:entity/:id",
    "title": "2. Get one record",
    "version": "1.0.0",
    "name": "GetOneRecord",
    "group": "DynamicRecords",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Get only one record from a dynamic entity table.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "https://localhost/api/de/dao/driver/2",
        "type": "json"
      },
      {
        "title": "Query Example:",
        "content": "https://localhost/api/de/dao/driver/2?q={\"limit\": 2}",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "entity",
            "description": "<p>Dynamic entity name.</p> "
          },
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the user.</p> "
          }
        ],
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "q",
            "description": "<p>(Query) Received all parameter defined by Sequelize documentations. Available <a href=\"http://docs.sequelizejs.com/en/latest/docs/querying/\" target=\"_blank\"> here.</a></p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "record",
            "description": "<p>One record from the dynamic entity table, based on ID end/or query.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 2,\n  \"full_name\": \"Chavo del Ocho\",\n  \"age\": 8,\n  \"createdAt\": \"2016-02-16T13:47:30.537Z\",\n  \"updatedAt\": \"2016-02-16T13:47:30.537Z\",\n  \"deletedAt\": null\n}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/dynamicDao/get.js",
    "groupTitle": "DynamicRecords",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/de/dao/:entity",
    "title": "1. Get array of records",
    "version": "1.0.0",
    "name": "GetRecords",
    "group": "DynamicRecords",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Get all records from a dynamic entity table.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "https://localhost/api/de/dao/driver",
        "type": "json"
      },
      {
        "title": "Query Example:",
        "content": "https://localhost/api/de/dao/driver?q={\"limit\": 2}",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "records",
            "description": "<p>List of records from the dynamic entity table.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"id\": 1,\n    \"full_name\": \"Jaime themailman\",\n    \"age\": 57,\n    \"createdAt\": \"2016-02-16T13:44:47.225Z\",\n    \"updatedAt\": \"2016-02-16T13:44:47.225Z\",\n    \"deletedAt\": null\n  },\n  {\n    \"id\": 2,\n    \"full_name\": \"Chavo del Ocho\",\n    \"age\": 8,\n    \"createdAt\": \"2016-02-16T13:47:30.537Z\",\n    \"updatedAt\": \"2016-02-16T13:47:30.537Z\",\n    \"deletedAt\": null\n  }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/dynamicDao/get.js",
    "groupTitle": "DynamicRecords",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "q",
            "description": "<p>(Query) Received all parameter defined by Sequelize documentations. Available <a href=\"http://docs.sequelizejs.com/en/latest/docs/querying/\" target=\"_blank\"> here.</a></p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/de/dao/:entity",
    "title": "3. Create a new record",
    "version": "1.0.0",
    "name": "PostRecord",
    "group": "DynamicRecords",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Insert a new record on the given dynamic entity table.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "https://localhost/api/de/dao/driver",
        "type": "json"
      },
      {
        "title": "Object Example:",
        "content": "{\n    \"full_name\": \"Jaime Themailman\",\n    \"age\": 57\n}",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "<p>Fields</p> ",
            "optional": false,
            "field": "field",
            "description": "<p>Field defined on dynamic entity creation {May be required and unique}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>Values</p> ",
            "optional": false,
            "field": "value",
            "description": "<p>Value fot the given field.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 1,\n  \"full_name\": \"Jaime themailman\",\n  \"age\": 57,\n  \"updatedAt\": \"2016-02-16T13:44:47.225Z\",\n  \"createdAt\": \"2016-02-16T13:44:47.225Z\",\n  \"deletedAt\": null\n}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/dynamicDao/post.js",
    "groupTitle": "DynamicRecords",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/api/de/dao/:entity/:id",
    "title": "4. Update an existing record",
    "version": "1.0.0",
    "name": "PutRecord",
    "group": "DynamicRecords",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Update a record from a dinamic entity table.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "entity",
            "description": "<p>Dynamic entity name.</p> "
          },
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the user.</p> "
          }
        ],
        "Body": [
          {
            "group": "Body",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "ID",
            "description": "<p>ID of the record on dynamic table;</p> "
          },
          {
            "group": "Body",
            "type": "<p>Fields</p> ",
            "optional": false,
            "field": "field",
            "description": "<p>Field defined on dynamic entity creation {May be required and unique}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>Values</p> ",
            "optional": false,
            "field": "value",
            "description": "<p>Value fot the given field.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Object Example:",
        "content": "{\n  \"id\": 2,\n  \"full_name\": \"Chavo del Ocho\",\n  \"age\": 9\n}",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 2,\n  \"full_name\": \"Chavo del Ocho\",\n  \"age\": 9,\n  \"createdAt\": \"2016-02-16T13:47:30.537Z\",\n  \"updatedAt\": \"2016-02-16T15:34:49.456Z\",\n  \"deletedAt\": null\n}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/dynamicDao/put.js",
    "groupTitle": "DynamicRecords",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/api/groups/:id",
    "title": "5. Remove a Group",
    "version": "1.0.0",
    "name": "DeleteGroup",
    "group": "Groups",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Group of collectors. May be grouped by institutions, places, types of collectors, etc. Remove a groups from database.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the group.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"id\": 1,\n    \"name\": \"Default Group\",\n    \"description\": \"Auto-generated Default Group\",\n    \"createdAt\": \"2015-11-23T16:50:22.064Z\",\n    \"updatedAt\": \"2015-11-23T16:50:22.064Z\",\n    \"deletedAt\": \"2015-11-27T17:55:12.910Z\",\n    \"isDefault\": null\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/groups/deleteGroup.js",
    "groupTitle": "Groups",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/groups",
    "title": "1. Get array of Groups",
    "version": "1.0.0",
    "name": "GetGroups",
    "group": "Groups",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Group of collectors. May be grouped by institutions, places, types of collectors, etc. To get all groups or groups based on query, use this route.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "https://localhost/api/groups",
        "type": "json"
      },
      {
        "title": "Query Example:",
        "content": "https://localhost/api/groups?q={\"limit\": 2}",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "groups",
            "description": "<p>List of Groups.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"id\": 1,\n    \"name\": \"Default Group\",\n    \"description\": \"Auto-generated Default Group\",\n    \"createdAt\": \"2015-11-23T16:50:22.064Z\",\n    \"updatedAt\": \"2015-11-23T16:50:22.064Z\",\n    \"deletedAt\": null,\n    \"isDefault\": true\n  },\n  {\n    \"id\": 2,\n    \"name\": \"Itaipu\",\n    \"description\": \"All Collectors on Itaipu\",\n    \"createdAt\": \"2015-11-23T16:50:22.064Z\",\n    \"updatedAt\": \"2015-11-23T16:50:22.064Z\",\n    \"deletedAt\": null,\n    \"isDefault\": null\n  }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/groups/getAll.js",
    "groupTitle": "Groups",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "q",
            "description": "<p>(Query) Received all parameter defined by Sequelize documentations. Available <a href=\"http://docs.sequelizejs.com/en/latest/docs/querying/\" target=\"_blank\"> here.</a></p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/groups/:id",
    "title": "2. Get only one Group",
    "version": "1.0.0",
    "name": "GetOneGroup",
    "group": "Groups",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Group of collectors. May be grouped by institutions, places, types of collectors, etc. To get one group using its ID, use this route.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the group.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "Id",
            "description": "<p>Group ID on database.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the group.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "description",
            "description": "<p>Defines the group.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Creation date generated by Sequelize.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>Last update of this group.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "deletedAt",
            "description": "<p>Null if group is not deleted or removal date.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "isDefault",
            "description": "<p>True for Group default or Null.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"id\": 1,\n    \"name\": \"Default Group\",\n    \"description\": \"Auto-generated Default Group\",\n    \"createdAt\": \"2015-11-23T16:50:22.064Z\",\n    \"updatedAt\": \"2015-11-23T16:50:22.064Z\",\n    \"deletedAt\": null,\n    \"isDefault\": true\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/groups/getOne.js",
    "groupTitle": "Groups",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/groups",
    "title": "3. Create a new Group",
    "version": "1.0.0",
    "name": "PostGroup",
    "group": "Groups",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Group of collectors. May be grouped by institutions, places, types of collectors, etc. Insert a new groups into database.</p> ",
    "examples": [
      {
        "title": "Object Example:",
        "content": "{\n  \"name\": \"Group Name\",\n  \"description\": \"Group Description\",\n  \"createdAt\": \"2015-11-23T16:50:22.064Z\",\n  \"updatedAt\": \"2015-11-23T16:50:22.064Z\",\n  \"deletedAt\": null,\n  \"isDefault\": null\n}",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the Group {Required, Unique}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "description",
            "description": "<p>Defines the Group, by a simple description.</p> "
          },
          {
            "group": "Body",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "isDefault",
            "description": "<p>True for default group, null otherwise {Unique}.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"id\": 1,\n    \"name\": \"Group Name\",\n    \"description\": \"Group Description\",\n    \"createdAt\": \"2015-11-23T16:50:22.064Z\",\n    \"updatedAt\": \"2015-11-23T16:50:22.064Z\",\n    \"deletedAt\": null,\n    \"isDefault\": null\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/groups/newGroup.js",
    "groupTitle": "Groups",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/api/groups/:id",
    "title": "4. Update an existing Group",
    "version": "1.0.0",
    "name": "PutGroup",
    "group": "Groups",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Group of collectors. May be grouped by institutions, places, types of collectors, etc. Use this URI to update a group from database.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the group.</p> "
          }
        ],
        "Body": [
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the Group {Required, Unique}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "description",
            "description": "<p>Defines the Group, by a simple description.</p> "
          },
          {
            "group": "Body",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "isDefault",
            "description": "<p>True for default group, null otherwise {Unique}.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Object Example:",
        "content": "{\n  \"id\": 1,\n  \"name\": \"Group Name\",\n  \"description\": \"Group Description\",\n  \"createdAt\": \"2015-11-23T16:50:22.064Z\",\n  \"updatedAt\": \"2015-11-23T16:50:22.064Z\",\n  \"deletedAt\": null,\n  \"isDefault\": true\n}",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"id\": 1,\n    \"name\": \"Group Name\",\n    \"description\": \"Group Description\",\n    \"createdAt\": \"2015-11-23T16:50:22.064Z\",\n    \"updatedAt\": \"2015-11-27T15:32:18.064Z\",\n    \"deletedAt\": null,\n    \"isDefault\": true\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/groups/updateGroup.js",
    "groupTitle": "Groups",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/media/:uuid",
    "title": "1. Get Media",
    "version": "1.0.0",
    "name": "GetMedia",
    "group": "Media",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Get a Media/Image from database.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "https://localhost/api/media/b2A76jPf2A1dWSvW0ceiL72pLxvIwZMjC9JGQ7c94XGB2DFmZVeaEa9RVaQsY222",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Image</p> ",
            "optional": false,
            "field": "image",
            "description": "<p>Image format.</p> "
          }
        ]
      }
    },
    "filename": "apidoc_source/media/getMedia.js",
    "groupTitle": "Media",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/media",
    "title": "2. Create a new Media",
    "version": "1.0.0",
    "name": "PostMedia",
    "group": "Media",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Insert a new Media and create a uuid to identify it.</p> ",
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "<p>File</p> ",
            "optional": false,
            "field": "image",
            "description": "<p>The Media/Image to be persist {Required}.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"mediaId\": \"b2A76jPf2A1dWSvW0ceiL72pLxvIwZMjC9JGQ7c94XGB2DFmZVeaEa9RVaQsY222\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/media/newMedia.js",
    "groupTitle": "Media",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/api/rfiddatas/:id",
    "title": "5. Remove an existing RFIData",
    "version": "1.0.0",
    "name": "DeleteRfidData",
    "group": "RFIDData",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>You are not allowed to make any change on rfidDatas.</p> ",
    "error": {
      "examples": [
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n \"message\": \"You are not allowed to make any change on rfidDatas\",\n \"status\": 403,\n \"error\": \"Not Allowed\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/rfiddatas/updates.js",
    "groupTitle": "RFIDData"
  },
  {
    "type": "get",
    "url": "/api/rfiddatas/:id",
    "title": "2. Get only one RFID Record",
    "version": "1.0.0",
    "name": "GetOneRfidData",
    "group": "RFIDData",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>RFIDData records from collecting point, defined by collectors.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the RFIDData record.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "Id",
            "description": "<p>RFIDData ID on database.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "rfidCode",
            "description": "<p>RFID code.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "rfidReadDate",
            "description": "<p>Read date and time from collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "serverReceivedDate",
            "description": "<p>Server recived Date and time.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Date time of creation record on database, defined by sequelize.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>Last update of this RFIDData (same as createdAt, because it will never change).</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "deletedAt",
            "description": "<p>Null if RFIDData is not deleted or removal date.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "collectorId",
            "description": "<p>ID of the collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "packageId",
            "description": "<p>ID of the package, used only by back-end.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "extraData",
            "description": "<p>Any other information (Dynamic purpouses).</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n \"id\": 1,\n \"rfidCode\": \"5555526\",\n \"extraData\": null,\n \"rfidReadDate\": \"2015-11-23T16:50:22.819Z\",\n \"serverReceivedDate\": \"2015-11-23T16:50:26.850Z\",\n \"createdAt\": \"2015-11-23T16:50:26.853Z\",\n \"updatedAt\": \"2015-11-23T16:50:26.853Z\",\n \"deletedAt\": null,\n \"collectorId\": 3,\n \"packageId\": 2\n}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/rfiddatas/getOne.js",
    "groupTitle": "RFIDData",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/rfiddatas",
    "title": "1. Get array of RFIDDatas",
    "version": "1.0.0",
    "name": "GetRfidData",
    "group": "RFIDData",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>RFIDData records from collecting point, defined by collectors.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "https://localhost/api/rfiddatas",
        "type": "json"
      },
      {
        "title": "Query Example:",
        "content": "https://localhost/api/rfiddatas?q={\"where\":{\"rfidCode\":\"5555526\"}, \"limit\":3, \"include\":[{\"all\":true}], \"entity\":\"carro\", \"entityQuery\":{\"where\":{\"placa\":\"ABC-1234\"}, \"include\":[{\"all\":true}]}}",
        "type": "json"
      },
      {
        "title": "Query Object example:",
        "content": "q={\n  \"where\":{\n    \"rfidCode\":\"5555526\"\n  },\n  \"limit\":3,\n  \"include\":[{\n    \"all\":true\n  }],\n  \"entity\":\"carro\",\n  \"embeddedRecords\":true,\n  \"entityQuery\":{\n    \"where\":{\n      \"placa\":\"ABC-1234\"\n    },\n    \"include\":[{\n      \"all\":true\n    }]\n  }\n}",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "groups",
            "description": "<p>List of RFIDData records.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"id\": 1,\n    \"rfidCode\": \"5555526\",\n    \"extraData\": null,\n    \"rfidReadDate\": \"2015-11-23T16:50:22.819Z\",\n    \"serverReceivedDate\": \"2015-11-23T16:50:26.850Z\",\n    \"createdAt\": \"2015-11-23T16:50:26.853Z\",\n    \"updatedAt\": \"2015-11-23T16:50:26.853Z\",\n    \"deletedAt\": null,\n    \"collectorId\": 3,\n    \"packageId\": 2\n  },\n  {\n    \"id\": 2,\n    \"rfidCode\": \"5555522\",\n    \"extraData\": null,\n    \"rfidReadDate\": \"2015-11-23T16:50:22.821Z\",\n    \"serverReceivedDate\": \"2015-11-23T16:50:26.852Z\",\n    \"createdAt\": \"2015-11-23T16:50:26.854Z\",\n    \"updatedAt\": \"2015-11-23T16:50:26.854Z\",\n    \"deletedAt\": null,\n    \"collectorId\": 3,\n    \"packageId\": 1\n  }\n]",
          "type": "json"
        },
        {
          "title": "Response with Entity:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"id\": 1,\n    \"rfidCode\": \"5555526\",\n    \"extraData\": null,\n    \"rfidReadDate\": \"2015-11-23T16:50:22.819Z\",\n    \"serverReceivedDate\": \"2015-11-23T16:50:26.850Z\",\n    \"createdAt\": \"2015-11-23T16:50:26.853Z\",\n    \"updatedAt\": \"2015-11-23T16:50:26.853Z\",\n    \"deletedAt\": null,\n    \"collectorId\": 3,\n    \"packageId\": 2,\n    \"entity\": {\n      \"id\": 2,\n      \"placa\": \"ABC-1234\",\n      \"chassi\": \"AS12345AJSD\",\n      \"foto_platform_media\": null,\n      \"pit\": \"5555526\",\n      \"motorista_id\": 1,\n      \"createdAt\": \"2015-12-04T19:09:03.206Z\",\n      \"updatedAt\": \"2015-12-04T19:09:03.206Z\",\n      \"deletedAt\": null\n    }\n  }\n]",
          "type": "json"
        },
        {
          "title": "Response with Embedded Records:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": 2,\n    \"placa\": \"ABC-1234\",\n    \"chassi\": \"AS12345AJSD\",\n    \"foto_platform_media\": null,\n    \"pit\": \"5555526\",\n    \"motorista_id\": 1,\n    \"createdAt\": \"2015-12-04T19:09:03.206Z\",\n    \"updatedAt\": \"2015-12-04T19:09:03.206Z\",\n    \"deletedAt\": null,\n    \"records\": [\n      {\n        \"id\": 1,\n        \"rfidCode\": \"5555526\",\n        \"extraData\": null,\n        \"rfidReadDate\": \"2015-11-23T16:50:22.819Z\",\n        \"serverReceivedDate\": \"2015-11-23T16:50:26.850Z\",\n        \"createdAt\": \"2015-11-23T16:50:26.853Z\",\n        \"updatedAt\": \"2015-11-23T16:50:26.853Z\",\n        \"deletedAt\": null,\n        \"collectorId\": 3,\n        \"packageId\": 2\n      }\n    ]\n  }",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "entity",
            "description": "<p>(Inside &quot;q&quot; object) Search RFIDData linkin with this Dinamic entity. Mandatory if embeddedRecords is true.</p> "
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "entityQuery",
            "description": "<p>(Inside &quot;q&quot; object) Search for all entities that match query defined by entityQuery parameter. Also receives sequelize queries (See <a href=\"http://docs.sequelizejs.com/en/latest/docs/querying/\" target=\"_blank\"> here</a>).</p> "
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "embeddedRecords",
            "description": "<p>(Inside &quot;q&quot; object) For each found entity, based on entityQuery, it searcs the related rfid records to embed as an array.</p> "
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "q",
            "description": "<p>(Query) Received all parameter defined by Sequelize documentations. Available <a href=\"http://docs.sequelizejs.com/en/latest/docs/querying/\" target=\"_blank\"> here.</a></p> "
          }
        ]
      }
    },
    "filename": "apidoc_source/rfiddatas/getAll.js",
    "groupTitle": "RFIDData",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/rfiddatas",
    "title": "3. Create a new RFIDData",
    "version": "1.0.0",
    "name": "PostRfidData",
    "group": "RFIDData",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>You are not allowed to make any change on rfidDatas.</p> ",
    "error": {
      "examples": [
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n \"message\": \"You are not allowed to make any change on rfidDatas\",\n \"status\": 403,\n \"error\": \"Not Allowed\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/rfiddatas/updates.js",
    "groupTitle": "RFIDData"
  },
  {
    "type": "put",
    "url": "/api/rfiddatas/:id",
    "title": "4. Update an existing RFIData",
    "version": "1.0.0",
    "name": "PutRfidData",
    "group": "RFIDData",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>You are not allowed to make any change on rfidDatas.</p> ",
    "error": {
      "examples": [
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n \"message\": \"You are not allowed to make any change on rfidDatas\",\n \"status\": 403,\n \"error\": \"Not Allowed\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/rfiddatas/updates.js",
    "groupTitle": "RFIDData"
  },
  {
    "type": "delete",
    "url": "/api/routeaccess/:id",
    "title": "5. Remove a RouteAccess",
    "version": "1.0.0",
    "name": "DeleteRouteAccess",
    "group": "RouteAccess",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Remove an existing RouteAccess from database.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the RouteAccess.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"id\": 2,\n    \"appClient\": 1,\n    \"uriRoute\": 2,\n    \"createdAt\": \"2016-02-17T12:56:46.999Z\",\n    \"updatedAt\": \"2016-02-17T12:59:04.510Z\",\n    \"deletedAt\": \"2016-02-17T13:01:55.123Z\"\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/routes/routeaccess/deleteAccess.js",
    "groupTitle": "RouteAccess",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/routeaccess/:id",
    "title": "2. Get only one AccessRoute",
    "version": "1.0.0",
    "name": "GetOneRouteAccess",
    "group": "RouteAccess",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Get one especific relation between a appClient and a route with a especific access method, that gives access to this route for the appClient.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the routeaccess.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "Id",
            "description": "<p>RouteAccess ID on database.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "appClient",
            "description": "<p>ID of the appClient that has this permission.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "uriRoute",
            "description": "<p>ID of the route that this appClient is allowed to Access.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "deletedAt",
            "description": "<p>Deletion datetime or null.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Creation datetime.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>Last update datetime, or creation datetime.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 1,\n  \"appClient\": 1,\n  \"uriRoute\": 2,\n  \"createdAt\": \"2016-02-11T12:42:54.875Z\",\n  \"updatedAt\": \"2016-02-11T12:42:54.875Z\",\n  \"deletedAt\": null\n}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/routes/routeaccess/getOne.js",
    "groupTitle": "RouteAccess",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/routeaccess",
    "title": "1. Get array of Access permissions",
    "version": "1.0.0",
    "name": "GetRouteAccess",
    "group": "RouteAccess",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Get all relations between a appClient and a route with a especific access method, that gives access to this route for the appClient.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "https://localhost/api/routeaccess",
        "type": "json"
      },
      {
        "title": "Query Example:",
        "content": "https://localhost/api/routeaccess?q={\"limit\": 1}",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "routeaccess",
            "description": "<p>List of relations between user and route.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  [\n    {\n      \"id\": 1,\n      \"appClient\": 1,\n      \"uriRoute\": 2,\n      \"createdAt\": \"2016-02-11T12:42:54.875Z\",\n      \"updatedAt\": \"2016-02-11T12:42:54.875Z\",\n      \"deletedAt\": null\n    }\n  ]",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/routes/routeaccess/getAll.js",
    "groupTitle": "RouteAccess",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "q",
            "description": "<p>(Query) Received all parameter defined by Sequelize documentations. Available <a href=\"http://docs.sequelizejs.com/en/latest/docs/querying/\" target=\"_blank\"> here.</a></p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/routeaccess",
    "title": "3. Create a new RouteAccess",
    "version": "1.0.0",
    "name": "PostRouteAccess",
    "group": "RouteAccess",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Create a new relation between a URI Route and an appClient that gives acces to this resource for the appClient.</p> ",
    "examples": [
      {
        "title": "Object Example:",
        "content": "{\n  \"appClient\":1,\n  \"uriRoute\": 1\n}",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "appClient",
            "description": "<p>ID of the related appClient {Required}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "uriRoute",
            "description": "<p>ID of the URI Route to give access for {Required}.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"id\": 2,\n    \"appClient\": 1,\n    \"uriRoute\": 1,\n    \"updatedAt\": \"2016-02-17T12:56:46.999Z\",\n    \"createdAt\": \"2016-02-17T12:56:46.999Z\",\n    \"deletedAt\": null\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/routes/routeaccess/newRouteAccess.js",
    "groupTitle": "RouteAccess",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/api/routeaccess/:id",
    "title": "4. Update an existing RouteAccess",
    "version": "1.0.0",
    "name": "PutRouteAccess",
    "group": "RouteAccess",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Update a RouteAccess from database.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the existing RouteAccess.</p> "
          }
        ],
        "Body": [
          {
            "group": "Body",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the existing RouteAccess {Required}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "appClient",
            "description": "<p>ID of the new related appClient {Required}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "uriRoute",
            "description": "<p>ID of the new URI Route to give access for {Required}.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Object Example:",
        "content": "{\n  \"id\": 2,\n  \"appClient\":1,\n  \"uriRoute\": 2\n}",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"id\": 2,\n    \"appClient\": 1,\n    \"uriRoute\": 2,\n    \"createdAt\": \"2016-02-17T12:56:46.999Z\",\n    \"updatedAt\": \"2016-02-17T12:59:04.510Z\",\n    \"deletedAt\": null\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/routes/routeaccess/updateAccess.js",
    "groupTitle": "RouteAccess",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/routes/:id",
    "title": "2. Get only one Route",
    "version": "1.0.0",
    "name": "GetOneRoute",
    "group": "Routes",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Get one Route available to consume and its respective access method.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the route.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "Id",
            "description": "<p>Route ID on database.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "path",
            "description": "<p>URI of the Route.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "method",
            "description": "<p>Access method for this URI.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "deletedAt",
            "description": "<p>Deletion datetime or null.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Creation datetime.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>Last update datetime, or creation datetime.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"id\": 1,\n    \"path\": \"/api/rfiddatas\",\n    \"method\": \"POST\",\n    \"deletedAt\": null,\n    \"createdAt\": \"2016-02-11T12:42:54.362Z\",\n    \"updatedAt\": \"2016-02-11T12:42:54.362Z\"\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/routes/uriRoutes/getOne.js",
    "groupTitle": "Routes",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/routes",
    "title": "1. Get array of routes",
    "version": "1.0.0",
    "name": "GetRoutes",
    "group": "Routes",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Get all routes available to consume from server and its respective access Methods.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "https://localhost/api/routes",
        "type": "json"
      },
      {
        "title": "Query Example:",
        "content": "https://localhost/api/routes?q={\"limit\": 4}",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "routes",
            "description": "<p>List of available routes and respective access Methods.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"id\": 1,\n    \"path\": \"/api/rfiddatas\",\n    \"method\": \"POST\",\n    \"deletedAt\": null,\n    \"createdAt\": \"2016-02-11T12:42:54.362Z\",\n    \"updatedAt\": \"2016-02-11T12:42:54.362Z\"\n  },\n  {\n    \"id\": 6,\n    \"path\": \"/api/groups\",\n    \"method\": \"GET\",\n    \"deletedAt\": null,\n    \"createdAt\": \"2016-02-11T12:42:54.504Z\",\n    \"updatedAt\": \"2016-02-11T12:42:54.504Z\"\n  },\n  {\n    \"id\": 11,\n    \"path\": \"/api/collectors\",\n    \"method\": \"POST\",\n    \"deletedAt\": null,\n    \"createdAt\": \"2016-02-11T12:42:54.543Z\",\n    \"updatedAt\": \"2016-02-11T12:42:54.543Z\"\n  },\n  {\n    \"id\": 16,\n    \"path\": \"/api/appclients\",\n    \"method\": \"PUT\",\n    \"deletedAt\": null,\n    \"createdAt\": \"2016-02-11T12:42:54.583Z\",\n    \"updatedAt\": \"2016-02-11T12:42:54.583Z\"\n  }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/routes/uriRoutes/get.js",
    "groupTitle": "Routes",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "q",
            "description": "<p>(Query) Received all parameter defined by Sequelize documentations. Available <a href=\"http://docs.sequelizejs.com/en/latest/docs/querying/\" target=\"_blank\"> here.</a></p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/api/users/:id",
    "title": "5. Remove a User",
    "version": "1.0.0",
    "name": "DeleteUser",
    "group": "Users",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Remove a User from database.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the user.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 1,\n  \"name\":\"Jaime\",\n  \"email\":\"jaiminho@correios.com.br\",\n  \"username\":\"jaiminho\",\n  \"deletedAt\": \"2015-11-27T17:55:12.910Z\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/users/deleteUser.js",
    "groupTitle": "Users",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/users/:id",
    "title": "2. Get only one User",
    "version": "1.0.0",
    "name": "GetOneUser",
    "group": "Users",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Get one user from database by its ID.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the user.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "Id",
            "description": "<p>User ID on database.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the User.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>E-mail to get in touch with the user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "username",
            "description": "<p>Username to log in the system.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>Password to log in the system.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 1,\n  \"name\":\"Jaime\",\n  \"email\":\"jaiminho@correios.com.br\",\n  \"username\":\"jaiminho\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/users/getOne.js",
    "groupTitle": "Users",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/users",
    "title": "1. Get array of users",
    "version": "1.0.0",
    "name": "GetUsers",
    "group": "Users",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Get all users from database or a groups of users based on a query.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "https://localhost/api/users",
        "type": "json"
      },
      {
        "title": "Query Example:",
        "content": "https://localhost/api/users?q={\"limit\": 2}",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "user",
            "description": "<p>List of Users.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n{\n  \"id\": 1,\n  \"name\":\"Jaime\",\n  \"email\":\"jaiminho@correios.com.br\",\n  \"username\":\"jaiminho\"\n},\n{\n  \"id\": 2,\n  \"name\":\"Administrator\",\n  \"email\":\"invalid@mail.com.br\",\n  \"username\":\"admin\"\n}\n]",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/users/getAll.js",
    "groupTitle": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "q",
            "description": "<p>(Query) Received all parameter defined by Sequelize documentations. Available <a href=\"http://docs.sequelizejs.com/en/latest/docs/querying/\" target=\"_blank\"> here.</a></p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/users",
    "title": "3. Create a new User",
    "version": "1.0.0",
    "name": "PostUser",
    "group": "Users",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Insert a new User on database.</p> ",
    "examples": [
      {
        "title": "Object Example:",
        "content": "{\n  \"name\":\"Jaime\",\n  \"email\":\"jaiminho@correios.com.br\",\n  \"username\":\"jaiminho\",\n  \"password\":\"jaiminho\",\n}",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the User {Required, Unique}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>Email to get in touch with the user {Required}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "username",
            "description": "<p>Username to log in the system {Required, Unique}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>Password to log in the system {Required}.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 1,\n  \"name\":\"Jaime\",\n  \"email\":\"jaiminho@correios.com.br\",\n  \"username\":\"jaiminho\",\n  \"appClient\": {\n    \"token\": \"uNgZnpGeKpr8JPMM4i1WT0KuiaeSYRT7\",\n    \"description\":\"Default appClient for jaiminho\",\n    \"userId\": 1,\n    \"createdAt\": \"2015-11-23T16:50:22.064Z\",\n    \"updatedAt\": \"2015-11-23T16:50:22.064Z\",\n    \"deletedAt\": null\n  }\n  \"createdAt\": \"2015-11-23T16:50:22.064Z\",\n  \"updatedAt\": \"2015-11-23T16:50:22.064Z\",\n  \"deletedAt\": null\n}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/users/newUser.js",
    "groupTitle": "Users",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/api/users/:id",
    "title": "4. Update an existing User",
    "version": "1.0.0",
    "name": "PutUser",
    "group": "Users",
    "permission": [
      {
        "name": "TokenAccess",
        "title": "The Client must have a token that allows it to get access on this resource.",
        "description": ""
      }
    ],
    "description": "<p>Update a User from database.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the user.</p> "
          }
        ],
        "Body": [
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the User {Required, Unique}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>Email to get in touch with the user {Required}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "username",
            "description": "<p>Username to log in the system {Required, Unique}.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>Password to log in the system {Required}.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Object Example:",
        "content": "{\n  \"id\": 1,\n  \"name\":\"Jaime\",\n  \"email\":\"jaiminho@correios.com.br\",\n  \"username\":\"jaiminho\",\n  \"password\":\"jaiminho\"\n}",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 1,\n  \"name\":\"Jaime\",\n  \"email\":\"jaiminho@correios.com.br\",\n  \"username\":\"jaiminho\",\n  \"updatedAt\": \"2015-11-27T15:32:18.064Z\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/users/updateUser.js",
    "groupTitle": "Users",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Missing Authorization headers or the given token do not exist. The client is Unauthorized and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization on the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The required resource does not exist.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ForbiddenError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"message\": \"Token not allowed for this opperation\",\n  \"status\": 403,\n  \"error\": \"Get out dog.\"\n}",
          "type": "json"
        },
        {
          "title": "ResponseError:",
          "content": "HTTP/1.1 'Code & Message'\n{\n \"message\": \"Any Message here\",\n \"status\": 'code',\n \"error\": \"Detailed error here\"\n}",
          "type": "json"
        }
      ]
    }
  }
] });