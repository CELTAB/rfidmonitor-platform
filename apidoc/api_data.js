define({ "api": [
  {
    "type": "delete",
    "url": "/api/collectors/:id",
    "title": "Delete a Collector",
    "version": "0.1.0",
    "name": "DeleteCollectors",
    "group": "Collectors",
    "permission": [
      {
        "name": "CustomAccess",
        "title": "The Client must be authenticated and also must have permission from the admin to get access.",
        "description": ""
      }
    ],
    "description": "<p>Remove a Collector from database.</p> ",
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
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://localhost/api/collectors/123",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "result",
            "description": "<p>TODO.</p> "
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
            "description": "<p>The client is not authenticated and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization to the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>TODO The requested ID matches with none Collector on database.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "LogicalError",
            "description": "<p>TODO Because of the platform's logic it is not possible to execute the request.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "String UnauthorizedError:",
          "content": "    HTTP/1.1 401 Unauthorized\n\t\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "json ForbiddenError:",
          "content": "    HTTP/1.1 403 Forbidden\n\t\t{\n\t\t\t\"error\" : \"Get out dog...\"\n\t\t}",
          "type": "json"
        },
        {
          "title": "json LogicalError:",
          "content": "    HTTP/1.1 403 TODO\n\t\t{\n\t\t\t\"error\" : \"TODO\"\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/apidoc.js",
    "groupTitle": "Collectors"
  },
  {
    "type": "get",
    "url": "/api/collectors/:id",
    "title": "Get a specific Collector",
    "version": "0.1.0",
    "name": "GetCollectorById",
    "group": "Collectors",
    "permission": [
      {
        "name": "CustomAccess",
        "title": "The Client must be authenticated and also must have permission from the admin to get access.",
        "description": ""
      }
    ],
    "description": "<p>Get a collector by its ID.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of requested Collector.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://localhost/api/collectors/123",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "collector",
            "description": "<p>Collector object found on database.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "collector.id",
            "description": "<p>ID of the Collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "collector.groupId",
            "description": "<p>Group ID of the Collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.mac",
            "description": "<p>MAC address of the Collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.name",
            "description": "<p>Name of the Collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.description",
            "description": "<p>Brief description of the Collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.status",
            "description": "<p>Status the Collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.lat",
            "description": "<p>Geolocation of the Collector - Latitude.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.lng",
            "description": "<p>Geolocation of the Collector - Longitude.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n\n\t\t{\n\t\t\t\"id\":\"1\",\n\t\t\t\"groupId\":\"1\",\n\t\t\t\"lat\":\"a1\",\n\t\t\t\"lng\":\"a\",\n\t\t\t\"mac\":\"AA:AA:11:AA:AA:aa\",\n\t\t\t\"name\":\"a\",\n\t\t\t\"status\":\"ONLINE\",\n\t\t\t\"description\":\"a\"\n\t\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The client is not authenticated and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization to the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>TODO The requested ID matches with none Collector on database.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "String UnauthorizedError:",
          "content": "    HTTP/1.1 401 Unauthorized\n\t\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "json ForbiddenError:",
          "content": "    HTTP/1.1 403 Forbidden\n\t\t{\n\t\t\t\"error\" : \"Get out dog...\"\n\t\t}",
          "type": "json"
        },
        {
          "title": "json NotFound:",
          "content": "    HTTP/1.1 400 Forbidden\n\t\t{\n\t\t\t\"TODO\" : \"TODO\"\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/apidoc.js",
    "groupTitle": "Collectors"
  },
  {
    "type": "get",
    "url": "/api/collectors",
    "title": "Get array of Collectors",
    "version": "0.1.0",
    "name": "GetCollectors",
    "group": "Collectors",
    "permission": [
      {
        "name": "CustomAccess",
        "title": "The Client must be authenticated and also must have permission from the admin to get access.",
        "description": ""
      }
    ],
    "description": "<p>Search on platform for Collectors that match the given restrictions.</p> ",
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "<p>Number</p> ",
            "allowedValues": [
              "{1-50}"
            ],
            "optional": false,
            "field": "limit",
            "defaultValue": "50",
            "description": "<p>Defines the maximum number of register to return.</p> "
          },
          {
            "group": "Query",
            "type": "<p>Number</p> ",
            "allowedValues": [
              "{1-50}"
            ],
            "optional": false,
            "field": "offset",
            "defaultValue": "0",
            "description": "<p>Defines the offset of register result to return.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://localhost/api/collectors",
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
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "collector.id",
            "description": "<p>ID of the Collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "collector.groupId",
            "description": "<p>Group ID of the Collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.mac",
            "description": "<p>MAC address of the Collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.name",
            "description": "<p>Name of the Collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.description",
            "description": "<p>Brief description of the Collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.status",
            "description": "<p>Status the Collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.lat",
            "description": "<p>Geolocation of the Collector - Latitude.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.lng",
            "description": "<p>Geolocation of the Collector - Longitude.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n\t[\n\t\t{\n\t\t\t\"id\":\"1\",\n\t\t\t\"groupId\":\"1\",\n\t\t\t\"lat\":\"a1\",\n\t\t\t\"lng\":\"a\",\n\t\t\t\"mac\":\"AA:AA:11:AA:AA:aa\",\n\t\t\t\"name\":\"a\",\n\t\t\t\"status\":\"ONLINE\",\n\t\t\t\"description\":\"a\"\n\t\t},\n\t\t{\n\t\t\t\"id\":\"2\",\n\t\t\t\"groupId\":\"1\",\n\t\t\t\"lat\":\"a1\",\n\t\t\t\"lng\":\"a\",\n\t\t\t\"mac\":\"AA:AA:11:AA:AA:BB\",\n\t\t\t\"name\":\"a\",\n\t\t\t\"status\":\"ONLINE\",\n\t\t\t\"description\":\"a\"\n\t\t}\n\t]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The client is not authenticated and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization to the requested resource.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "String UnauthorizedError:",
          "content": "    HTTP/1.1 401 Unauthorized\n\t\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "json ForbiddenError:",
          "content": "    HTTP/1.1 403 Forbidden\n\t\t{\n\t\t\t\"error\" : \"Get out dog...\"\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/apidoc.js",
    "groupTitle": "Collectors"
  },
  {
    "type": "post",
    "url": "/api/collectors",
    "title": "Insert Collectors",
    "version": "0.1.0",
    "name": "PostCollectors",
    "group": "Collectors",
    "permission": [
      {
        "name": "CustomAccess",
        "title": "The Client must be authenticated and also must have permission from the admin to get access.",
        "description": ""
      }
    ],
    "description": "<p>Insert a new Collector.</p> ",
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "collector",
            "description": "<p>Collector object to be inserted.</p> "
          },
          {
            "group": "Body",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "collector.groupId",
            "description": "<p>Group ID the collector is related.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.mac",
            "description": "<p>MAC address of the Collector.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.name",
            "description": "<p>Name of the Collector.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.description",
            "description": "<p>Brief description of the Collector.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "allowedValues": [
              "'ONLINE'",
              "'OFFLINE'"
            ],
            "optional": false,
            "field": "collector.status",
            "description": "<p>Status the Collector.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.lat",
            "description": "<p>Geolocation of the Collector - Latitude.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.lng",
            "description": "<p>Geolocation of the Collector - Longitude.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://localhost/api/collectors",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "result",
            "description": "<p>ID of the inserted Collector.</p> "
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
            "description": "<p>The client is not authenticated and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization to the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "LogicalError",
            "description": "<p>TODO Because of the platform's logic it is not possible to execute the request.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "String UnauthorizedError:",
          "content": "    HTTP/1.1 401 Unauthorized\n\t\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "json ForbiddenError:",
          "content": "    HTTP/1.1 403 Forbidden\n\t\t{\n\t\t\t\"error\" : \"Get out dog...\"\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/apidoc.js",
    "groupTitle": "Collectors"
  },
  {
    "type": "put",
    "url": "/api/collectors/:id",
    "title": "Update a Collector",
    "version": "0.1.0",
    "name": "PutCollectors",
    "group": "Collectors",
    "permission": [
      {
        "name": "CustomAccess",
        "title": "The Client must be authenticated and also must have permission from the admin to get access.",
        "description": ""
      }
    ],
    "description": "<p>Updated the fields of a Collector.</p> ",
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
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "collector",
            "description": "<p>Collector object to be updated.</p> "
          },
          {
            "group": "Body",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "collector.id",
            "description": "<p>ID of the collector.</p> "
          },
          {
            "group": "Body",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "collector.groupId",
            "description": "<p>Group ID the collector is related.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.mac",
            "description": "<p>MAC address of the Collector.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.name",
            "description": "<p>Name of the Collector.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.description",
            "description": "<p>Brief description of the Collector.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "allowedValues": [
              "'ONLINE'",
              "'OFFLINE'"
            ],
            "optional": false,
            "field": "collector.status",
            "description": "<p>Status the Collector.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.lat",
            "description": "<p>Geolocation of the Collector - Latitude.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "collector.lng",
            "description": "<p>Geolocation of the Collector - Longitude.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://localhost/api/collectors/123",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "result",
            "description": "<p>TODO.</p> "
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
            "description": "<p>The client is not authenticated and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization to the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>TODO The requested ID matches with none Collector on database.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "LogicalError",
            "description": "<p>TODO Because of the platform's logic it is not possible to execute the request.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "String UnauthorizedError:",
          "content": "    HTTP/1.1 401 Unauthorized\n\t\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "json ForbiddenError:",
          "content": "    HTTP/1.1 403 Forbidden\n\t\t{\n\t\t\t\"error\" : \"Get out dog...\"\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/apidoc.js",
    "groupTitle": "Collectors"
  },
  {
    "type": "delete",
    "url": "/api/groups/:id",
    "title": "Delete a Group",
    "version": "0.1.0",
    "name": "DeleteGroups",
    "group": "Groups",
    "permission": [
      {
        "name": "CustomAccess",
        "title": "The Client must be authenticated and also must have permission from the admin to get access.",
        "description": ""
      }
    ],
    "description": "<p>Remove a Group from database.</p> ",
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
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://localhost/api/groups/123",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "result",
            "description": "<p>TODO.</p> "
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
            "description": "<p>The client is not authenticated and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization to the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>TODO The requested ID matches with none Group on database.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "LogicalError",
            "description": "<p>TODO Because of the platform's logic it is not possible to execute the request.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "String UnauthorizedError:",
          "content": "    HTTP/1.1 401 Unauthorized\n\t\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "json ForbiddenError:",
          "content": "    HTTP/1.1 403 Forbidden\n\t\t{\n\t\t\t\"error\" : \"Get out dog...\"\n\t\t}",
          "type": "json"
        },
        {
          "title": "json LogicalError:",
          "content": "    HTTP/1.1 403 TODO\n\t\t{\n\t\t\t\"error\" : \"TODO\"\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/apidoc.js",
    "groupTitle": "Groups"
  },
  {
    "type": "get",
    "url": "/api/groups/:id",
    "title": "Get a specific Group",
    "version": "0.1.0",
    "name": "GetGroupById",
    "group": "Groups",
    "permission": [
      {
        "name": "CustomAccess",
        "title": "The Client must be authenticated and also must have permission from the admin to get access.",
        "description": ""
      }
    ],
    "description": "<p>Get a Group by its ID.</p> ",
    "parameter": {
      "fields": {
        "Param": [
          {
            "group": "Param",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>ID of requested Group.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://localhost/api/groups/123",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "group",
            "description": "<p>Group object found on database.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "group.id",
            "description": "<p>ID of the Group.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "group.name",
            "description": "<p>Name of the Group.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "group.description",
            "description": "<p>Brief description of the Group.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "group.creationDate",
            "description": "<p>Date of Group's creation.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "group.isDefault",
            "description": "<p>Define if it must be considered the default group for new groups.</p> "
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
            "description": "<p>The client is not authenticated and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization to the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>TODO The requested ID matches with none Group on database.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "String UnauthorizedError:",
          "content": "    HTTP/1.1 401 Unauthorized\n\t\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "json ForbiddenError:",
          "content": "    HTTP/1.1 403 Forbidden\n\t\t{\n\t\t\t\"error\" : \"Get out dog...\"\n\t\t}",
          "type": "json"
        },
        {
          "title": "json NotFound:",
          "content": "    HTTP/1.1 400 Forbidden\n\t\t{\n\t\t\t\"TODO\" : \"TODO\"\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/apidoc.js",
    "groupTitle": "Groups"
  },
  {
    "type": "get",
    "url": "/api/groups",
    "title": "Get array of Groups",
    "version": "0.1.0",
    "name": "GetGroups",
    "group": "Groups",
    "permission": [
      {
        "name": "CustomAccess",
        "title": "The Client must be authenticated and also must have permission from the admin to get access.",
        "description": ""
      }
    ],
    "description": "<p>Search on platform for Groups that match the given parameters.</p> ",
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "<p>Number</p> ",
            "allowedValues": [
              "{1-50}"
            ],
            "optional": false,
            "field": "limit",
            "defaultValue": "50",
            "description": "<p>Defines the maximum number of register to return.</p> "
          },
          {
            "group": "Query",
            "type": "<p>Number</p> ",
            "allowedValues": [
              "{1-50}"
            ],
            "optional": false,
            "field": "offset",
            "defaultValue": "0",
            "description": "<p>Defines the offset of register result to return.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://localhost/api/groups",
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
            "field": "group",
            "description": "<p>List of Groups.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "group.id",
            "description": "<p>ID of the Group.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "group.name",
            "description": "<p>Name of the Group.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "group.description",
            "description": "<p>Brief description of the Group.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "group.creationDate",
            "description": "<p>Date of Group's creation.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "group.isDefault",
            "description": "<p>Define if it must be considered the default group for new groups.</p> "
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
            "description": "<p>The client is not authenticated and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization to the requested resource.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "String UnauthorizedError:",
          "content": "    HTTP/1.1 401 Unauthorized\n\t\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "json ForbiddenError:",
          "content": "    HTTP/1.1 403 Forbidden\n\t\t{\n\t\t\t\"error\" : \"Get out dog...\"\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/apidoc.js",
    "groupTitle": "Groups"
  },
  {
    "type": "post",
    "url": "/api/groups",
    "title": "Insert Groups",
    "version": "0.1.0",
    "name": "PostGroups",
    "group": "Groups",
    "permission": [
      {
        "name": "CustomAccess",
        "title": "The Client must be authenticated and also must have permission from the admin to get access.",
        "description": ""
      }
    ],
    "description": "<p>Insert a new Group.</p> ",
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "group",
            "description": "<p>Group object to be inserted.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "group.name",
            "description": "<p>Name of the Group.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "group.description",
            "description": "<p>Brief description of the Group.</p> "
          },
          {
            "group": "Body",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "group.creationDate",
            "description": "<p>Date of Group's creation.</p> "
          },
          {
            "group": "Body",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "group.isDefault",
            "description": "<p>Define if it must be considered the default group for new groups.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://localhost/api/groups",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "result",
            "description": "<p>ID of the inserted Group.</p> "
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
            "description": "<p>The client is not authenticated and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization to the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "LogicalError",
            "description": "<p>TODO Because of the platform's logic it is not possible to execute the request.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "String UnauthorizedError:",
          "content": "    HTTP/1.1 401 Unauthorized\n\t\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "json ForbiddenError:",
          "content": "    HTTP/1.1 403 Forbidden\n\t\t{\n\t\t\t\"error\" : \"Get out dog...\"\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/apidoc.js",
    "groupTitle": "Groups"
  },
  {
    "type": "put",
    "url": "/api/groups/:id",
    "title": "Update a Group",
    "version": "0.1.0",
    "name": "PutGroups",
    "group": "Groups",
    "permission": [
      {
        "name": "CustomAccess",
        "title": "The Client must be authenticated and also must have permission from the admin to get access.",
        "description": ""
      }
    ],
    "description": "<p>Updated the fields of a Group.</p> ",
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
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "group",
            "description": "<p>Group object to be inserted.</p> "
          },
          {
            "group": "Body",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "group.id",
            "description": "<p>ID of the Group.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "group.name",
            "description": "<p>Name of the Group.</p> "
          },
          {
            "group": "Body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "group.description",
            "description": "<p>Brief description of the Group.</p> "
          },
          {
            "group": "Body",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "group.creationDate",
            "description": "<p>Date of Group's creation.</p> "
          },
          {
            "group": "Body",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "group.isDefault",
            "description": "<p>Define if it must be considered the default group for new groups.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://localhost/api/groups/123",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "result",
            "description": "<p>TODO.</p> "
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
            "description": "<p>The client is not authenticated and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization to the requested resource.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>TODO The requested ID matches with none Group on database.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "LogicalError",
            "description": "<p>TODO Because of the platform's logic it is not possible to execute the request.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "String UnauthorizedError:",
          "content": "    HTTP/1.1 401 Unauthorized\n\t\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "json ForbiddenError:",
          "content": "    HTTP/1.1 403 Forbidden\n\t\t{\n\t\t\t\"error\" : \"Get out dog...\"\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/apidoc.js",
    "groupTitle": "Groups"
  },
  {
    "type": "get",
    "url": "/api/permissions",
    "title": "Get List of Permissions",
    "version": "0.1.0",
    "name": "GetPermissions",
    "group": "Permissions",
    "permission": [
      {
        "name": "AuthenticatedAccess",
        "title": "The Client must be authenticated to get access.",
        "description": ""
      }
    ],
    "description": "<p>Search on platform for resources the current Client has authorization.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://localhost/api/permissions",
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
            "field": "permission",
            "description": "<p>List of Permissions.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "permission.route",
            "description": "<p>Defines the URI path to the resource.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "allowedValues": [
              "GET",
              "POST",
              "PUT",
              "DELETE",
              "ANY"
            ],
            "optional": false,
            "field": "permission.method",
            "description": "<p>Defines the methods allowed.</p> "
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
            "description": "<p>The client is not authenticated and can't use the API.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "String UnauthorizedError:",
          "content": "    HTTP/1.1 401 Unauthorized\n\t\t\"Unauthorized\"",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/apidoc.js",
    "groupTitle": "Permissions"
  },
  {
    "type": "get",
    "url": "/api/rfiddata",
    "title": "Get array of Rfiddata",
    "version": "0.1.0",
    "name": "GetRfiddata",
    "group": "Rfiddata",
    "permission": [
      {
        "name": "CustomAccess",
        "title": "The Client must be authenticated and also must have permission from the admin to get access.",
        "description": ""
      }
    ],
    "description": "<p>Search on platform for Rfiddata that match the given parameters.</p> ",
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "<p>Number</p> ",
            "allowedValues": [
              "{1-50}"
            ],
            "optional": false,
            "field": "limit",
            "defaultValue": "50",
            "description": "<p>Defines the maximum number of register to return.</p> "
          },
          {
            "group": "Query",
            "type": "<p>Number</p> ",
            "allowedValues": [
              "{1-50}"
            ],
            "optional": false,
            "field": "offset",
            "defaultValue": "0",
            "description": "<p>Defines the offset of register result to return.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://localhost/api/rfiddata",
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
            "field": "rfiddata",
            "description": "<p>List of Rfiddata.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "rfiddata.id",
            "description": "<p>Platform ID of the Rfiddata.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "rfiddata.rfidReadDate",
            "description": "<p>Date when the Collector collected the data.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "rfiddata.serverReceivedDate",
            "description": "<p>Date when the Platform received the data from Collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "rfiddata.rfidcode",
            "description": "<p>Rfid code itself.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "rfiddata.collectorId",
            "description": "<p>ID of the collector where the data came from.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "rfiddata.packageId",
            "description": "<p>ID of the package sent by Collector containing the data.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "rfiddata.extraData",
            "description": "<p>A object sent by Collector containing custom information.</p> "
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
            "description": "<p>The client is not authenticated and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization to the requested resource.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "String UnauthorizedError:",
          "content": "    HTTP/1.1 401 Unauthorized\n\t\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "json ForbiddenError:",
          "content": "    HTTP/1.1 403 Forbidden\n\t\t{\n\t\t\t\"error\" : \"Get out dog...\"\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/apidoc.js",
    "groupTitle": "Rfiddata"
  },
  {
    "type": "get",
    "url": "/api/rfiddata/:rfidcode",
    "title": "Get array of Rfiddata by Rfidcode",
    "version": "0.1.0",
    "name": "GetRfiddataByRfidcode",
    "group": "Rfiddata",
    "permission": [
      {
        "name": "CustomAccess",
        "title": "The Client must be authenticated and also must have permission from the admin to get access.",
        "description": ""
      }
    ],
    "description": "<p>Search on platform for Rfiddata that match the given rfidcode.</p> ",
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "<p>Number</p> ",
            "allowedValues": [
              "{1-50}"
            ],
            "optional": false,
            "field": "limit",
            "defaultValue": "50",
            "description": "<p>Defines the maximum number of register to return.</p> "
          },
          {
            "group": "Query",
            "type": "<p>Number</p> ",
            "allowedValues": [
              "{1-50}"
            ],
            "optional": false,
            "field": "offset",
            "defaultValue": "0",
            "description": "<p>Defines the offset of register result to return.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://localhost/api/rfiddata/987654321",
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
            "field": "rfiddata",
            "description": "<p>List of Rfiddata.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "rfiddata.id",
            "description": "<p>Platform ID of the Rfiddata.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "rfiddata.rfidReadDate",
            "description": "<p>Date when the Collector collected the data.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "rfiddata.serverReceivedDate",
            "description": "<p>Date when the Platform received the data from Collector.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "rfiddata.rfidcode",
            "description": "<p>Rfid code itself.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "rfiddata.collectorId",
            "description": "<p>ID of the collector where the data came from.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "rfiddata.packageId",
            "description": "<p>ID of the package sent by Collector containing the data.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "rfiddata.extraData",
            "description": "<p>A object sent by Collector containing custom information.</p> "
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
            "description": "<p>The client is not authenticated and can't use the API.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The client is authenticated but has not authorization to the requested resource.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "String UnauthorizedError:",
          "content": "    HTTP/1.1 401 Unauthorized\n\t\t\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "json ForbiddenError:",
          "content": "    HTTP/1.1 403 Forbidden\n\t\t{\n\t\t\t\"error\" : \"Get out dog...\"\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc_source/apidoc.js",
    "groupTitle": "Rfiddata"
  }
] });