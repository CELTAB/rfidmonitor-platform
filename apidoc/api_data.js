define({ "api": [
  {
    "type": "get",
    "url": "/api/collectors",
    "title": "Get array of Collectors",
    "version": "0.0.1",
    "name": "GetCollectors",
    "group": "Collectors",
    "permission": [
      {
        "name": "CustomAccess",
        "title": "Access defined by an Admin",
        "description": ""
      }
    ],
    "description": "<p>Search on platform for Collectors that match the given restrictions.</p> ",
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "<p>String</p> ",
            "allowedValues": [
              "'ONLINE'",
              "'OFFLINE'"
            ],
            "optional": false,
            "field": "testParam",
            "description": "<p>This is a mega test param.</p> "
          },
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
        "content": "curl -i https://example.com/api/collectors",
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
            "description": "<p>List of user Collectors.</p> "
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
    "filename": "controllers/platformrouter.js",
    "groupTitle": "Collectors"
  },
  {
    "type": "post",
    "url": "/api/collectors",
    "title": "Insert Collectors",
    "version": "0.0.1",
    "name": "PostCollectors",
    "group": "Collectors",
    "permission": [
      {
        "name": "CustomAccess",
        "title": "Access defined by an Admin",
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
            "allowedValues": [
              "{1-50}"
            ],
            "optional": false,
            "field": "collector.groupId",
            "description": "<p>Group ID the collector is related.</p> "
          }
        ],
        "Query": [
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
        "content": "curl -i https://example.com/api/collectors",
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
            "description": "<p>List of user Collectors.</p> "
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
    "filename": "controllers/platformrouter.js",
    "groupTitle": "Collectors"
  }
] });