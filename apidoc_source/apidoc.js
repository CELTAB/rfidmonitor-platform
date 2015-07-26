/**
	* @apiDefine CustomAccess The Client must be authenticated and also must have permission from the admin to get access. 
	*/

	/**
	* @apiDefine AuthenticatedAccess The Client must be authenticated to get access. 
	*/

	/**
	* @api {get} /api/collectors Get array of Collectors
	* @apiVersion 0.1.0
	* @apiName GetCollectors
	* @apiGroup Collectors
	* @apiPermission CustomAccess
	*
	* @apiDescription Search on platform for Collectors that match the given restrictions. 
	*
	* @apiParam (Query) {Number={1-50}} limit=50 Defines the maximum number of register to return.
	* @apiParam (Query) {Number={1-50}} offset=0 Defines the offset of register result to return.
	*
	* @apiExample Example usage:
	* curl -i https://localhost/api/collectors
	*
	* @apiSuccess {Object[]} collector       List of Collectors.
	* @apiSuccess {Number}   collector.id   ID of the Collector.
	* @apiSuccess {Number}   collector.groupId   Group ID of the Collector.
	* @apiSuccess {String}   collector.mac   MAC address of the Collector.
	* @apiSuccess {String}   collector.name   Name of the Collector.
	* @apiSuccess {String}   collector.description   Brief description of the Collector.
	* @apiSuccess {String}   collector.status   Status the Collector.
	* @apiSuccess {String}   collector.lat   Geolocation of the Collector - Latitude.
	* @apiSuccess {String}   collector.lng   Geolocation of the Collector - Longitude.
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*	[
	*		{
	*			"id":"1",
	*			"groupId":"1",
	*			"lat":"a1",
	*			"lng":"a",
	*			"mac":"AA:AA:11:AA:AA:aa",
	*			"name":"a",
	*			"status":"ONLINE",
	*			"description":"a"
	*		},
	*		{
	*			"id":"2",
	*			"groupId":"1",
	*			"lat":"a1",
	*			"lng":"a",
	*			"mac":"AA:AA:11:AA:AA:BB",
	*			"name":"a",
	*			"status":"ONLINE",
	*			"description":"a"
	*		}
	*	]
	*
	* @apiError Unauthorized The client is not authenticated and can't use the API.
	* @apiError Forbidden The client is authenticated but has not authorization to the requested resource.
	*
	* @apiErrorExample String UnauthorizedError:
	*     HTTP/1.1 401 Unauthorized
	*		"Unauthorized"
	*
	* @apiErrorExample json ForbiddenError:
	*     HTTP/1.1 403 Forbidden
	*		{
	*			"error" : "Get out dog..."
	*		}
	*/

	/**
	* @api {get} /api/collectors/:id Get a specific Collector
	* @apiVersion 0.1.0
	* @apiName GetCollectorById
	* @apiGroup Collectors
	* @apiPermission CustomAccess
	*
	* @apiDescription Get a collector by its ID. 
	*
	* @apiParam (Param) {Number} id ID of requested Collector.
	*
	* @apiExample Example usage:
	* curl -i https://localhost/api/collectors/123
	*
	* @apiSuccess {Object} collector Collector object found on database.
	* @apiSuccess {Number}   collector.id   ID of the Collector.
	* @apiSuccess {Number}   collector.groupId   Group ID of the Collector.
	* @apiSuccess {String}   collector.mac   MAC address of the Collector.
	* @apiSuccess {String}   collector.name   Name of the Collector.
	* @apiSuccess {String}   collector.description   Brief description of the Collector.
	* @apiSuccess {String}   collector.status   Status the Collector.
	* @apiSuccess {String}   collector.lat   Geolocation of the Collector - Latitude.
	* @apiSuccess {String}   collector.lng   Geolocation of the Collector - Longitude.
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*
	*		{
	*			"id":"1",
	*			"groupId":"1",
	*			"lat":"a1",
	*			"lng":"a",
	*			"mac":"AA:AA:11:AA:AA:aa",
	*			"name":"a",
	*			"status":"ONLINE",
	*			"description":"a"
	*		}
	*
	* @apiError Unauthorized The client is not authenticated and can't use the API.
	* @apiError Forbidden The client is authenticated but has not authorization to the requested resource.
	* @apiError NotFound TODO The requested ID matches with none Collector on database.
	*
	* @apiErrorExample String UnauthorizedError:
	*     HTTP/1.1 401 Unauthorized
	*		"Unauthorized"
	*
	* @apiErrorExample json ForbiddenError:
	*     HTTP/1.1 403 Forbidden
	*		{
	*			"error" : "Get out dog..."
	*		}
	*
	* @apiErrorExample json NotFound:
	*     HTTP/1.1 400 Forbidden
	*		{
	*			"TODO" : "TODO"
	*		}
	*/

	/**
	* @api {post} /api/collectors Insert Collectors
	* @apiVersion 0.1.0
	* @apiName PostCollectors
	* @apiGroup Collectors
	* @apiPermission CustomAccess
	*
	* @apiDescription Insert a new Collector. 
	*
	* @apiParam (Body) {Object} collector Collector object to be inserted.
	* @apiParam (Body) {Number} collector.groupId Group ID the collector is related.
	* @apiParam (Body) {String} collector.mac   MAC address of the Collector.
	* @apiParam (Body) {String} collector.name   Name of the Collector.
	* @apiParam (Body) {String} collector.description   Brief description of the Collector.
	* @apiParam (Body) {String='ONLINE','OFFLINE'} collector.status   Status the Collector.
	* @apiParam (Body) {String} collector.lat   Geolocation of the Collector - Latitude.
	* @apiParam (Body) {String} collector.lng   Geolocation of the Collector - Longitude.
	*
	* @apiExample Example usage:
	* curl -i https://localhost/api/collectors
	*
	* @apiSuccess {Number} result ID of the inserted Collector.
	*
	* @apiError Unauthorized The client is not authenticated and can't use the API.
	* @apiError Forbidden The client is authenticated but has not authorization to the requested resource.
	* @apiError LogicalError TODO Because of the platform's logic it is not possible to execute the request.
	*
	* @apiErrorExample String UnauthorizedError:
	*     HTTP/1.1 401 Unauthorized
	*		"Unauthorized"
	*
	* @apiErrorExample json ForbiddenError:
	*     HTTP/1.1 403 Forbidden
	*		{
	*			"error" : "Get out dog..."
	*		}
	*/

	/**
	* @api {put} /api/collectors/:id Update a Collector
	* @apiVersion 0.1.0
	* @apiName PutCollectors
	* @apiGroup Collectors
	* @apiPermission CustomAccess
	*
	* @apiDescription Updated the fields of a Collector. 
	*
	* @apiParam (Param) {Number} id ID of the collector.
	*
	* @apiParam (Body) {Object} collector Collector object to be updated.
	* @apiParam (Body) {Number} collector.id ID of the collector.
	* @apiParam (Body) {Number} collector.groupId Group ID the collector is related.
	* @apiParam (Body) {String} collector.mac   MAC address of the Collector.
	* @apiParam (Body) {String} collector.name   Name of the Collector.
	* @apiParam (Body) {String} collector.description   Brief description of the Collector.
	* @apiParam (Body) {String='ONLINE','OFFLINE'} collector.status   Status the Collector.
	* @apiParam (Body) {String} collector.lat   Geolocation of the Collector - Latitude.
	* @apiParam (Body) {String} collector.lng   Geolocation of the Collector - Longitude.
	*
	* @apiExample Example usage:
	* curl -i https://localhost/api/collectors/123
	*
	* @apiSuccess {Number} result TODO.
	*
	* @apiError Unauthorized The client is not authenticated and can't use the API.
	* @apiError Forbidden The client is authenticated but has not authorization to the requested resource.
	* @apiError NotFound TODO The requested ID matches with none Collector on database.
	* @apiError LogicalError TODO Because of the platform's logic it is not possible to execute the request.
	*
	* @apiErrorExample String UnauthorizedError:
	*     HTTP/1.1 401 Unauthorized
	*		"Unauthorized"
	*
	* @apiErrorExample json ForbiddenError:
	*     HTTP/1.1 403 Forbidden
	*		{
	*			"error" : "Get out dog..."
	*		}
	*/

	/**
	* @api {delete} /api/collectors/:id Delete a Collector
	* @apiVersion 0.1.0
	* @apiName DeleteCollectors
	* @apiGroup Collectors
	* @apiPermission CustomAccess
	*
	* @apiDescription Remove a Collector from database. 
	*
	* @apiParam (Param) {Number} id ID of the collector.
	*
	* @apiExample Example usage:
	* curl -i https://localhost/api/collectors/123
	*
	* @apiSuccess {Number} result TODO.
	*
	* @apiError Unauthorized The client is not authenticated and can't use the API.
	* @apiError Forbidden The client is authenticated but has not authorization to the requested resource.
	* @apiError NotFound TODO The requested ID matches with none Collector on database.
	* @apiError LogicalError TODO Because of the platform's logic it is not possible to execute the request.
	*
	* @apiErrorExample String UnauthorizedError:
	*     HTTP/1.1 401 Unauthorized
	*		"Unauthorized"
	*
	* @apiErrorExample json ForbiddenError:
	*     HTTP/1.1 403 Forbidden
	*		{
	*			"error" : "Get out dog..."
	*		}
	*
	* @apiErrorExample json LogicalError:
	*     HTTP/1.1 403 TODO
	*		{
	*			"error" : "TODO"
	*		}
	*/

	/**
	* @api {get} /api/groups Get array of Groups
	* @apiVersion 0.1.0
	* @apiName GetGroups
	* @apiGroup Groups
	* @apiPermission CustomAccess
	*
	* @apiDescription Search on platform for Groups that match the given parameters. 
	*
	* @apiParam (Query) {Number={1-50}} limit=50 Defines the maximum number of register to return.
	* @apiParam (Query) {Number={1-50}} offset=0 Defines the offset of register result to return.
	*
	* @apiExample Example usage:
	* curl -i https://localhost/api/groups
	*
	* @apiSuccess {Object[]} group       List of Groups.
	* @apiSuccess {Number}   group.id   ID of the Group.
	* @apiSuccess {String}   group.name   Name of the Group.
	* @apiSuccess {String}   group.description   Brief description of the Group.
	* @apiSuccess {Date}   group.creationDate   Date of Group's creation.
	* @apiSuccess {Boolean}   group.isDefault   Define if it must be considered the default group for new groups.
	*
	* @apiError Unauthorized The client is not authenticated and can't use the API.
	* @apiError Forbidden The client is authenticated but has not authorization to the requested resource.
	*
	* @apiErrorExample String UnauthorizedError:
	*     HTTP/1.1 401 Unauthorized
	*		"Unauthorized"
	*
	* @apiErrorExample json ForbiddenError:
	*     HTTP/1.1 403 Forbidden
	*		{
	*			"error" : "Get out dog..."
	*		}
	*/

	/**
	* @api {get} /api/groups/:id Get a specific Group
	* @apiVersion 0.1.0
	* @apiName GetGroupById
	* @apiGroup Groups
	* @apiPermission CustomAccess
	*
	* @apiDescription Get a Group by its ID. 
	*
	* @apiParam (Param) {Number} id ID of requested Group.
	*
	* @apiExample Example usage:
	* curl -i https://localhost/api/groups/123
	*
	* @apiSuccess {Object} group Group object found on database.
	* @apiSuccess {Number}   group.id   ID of the Group.
	* @apiSuccess {String}   group.name   Name of the Group.
	* @apiSuccess {String}   group.description   Brief description of the Group.
	* @apiSuccess {Date}   group.creationDate   Date of Group's creation.
	* @apiSuccess {Boolean}   group.isDefault   Define if it must be considered the default group for new groups.
	*
	* @apiError Unauthorized The client is not authenticated and can't use the API.
	* @apiError Forbidden The client is authenticated but has not authorization to the requested resource.
	* @apiError NotFound TODO The requested ID matches with none Group on database.
	*
	* @apiErrorExample String UnauthorizedError:
	*     HTTP/1.1 401 Unauthorized
	*		"Unauthorized"
	*
	* @apiErrorExample json ForbiddenError:
	*     HTTP/1.1 403 Forbidden
	*		{
	*			"error" : "Get out dog..."
	*		}
	*
	* @apiErrorExample json NotFound:
	*     HTTP/1.1 400 Forbidden
	*		{
	*			"TODO" : "TODO"
	*		}
	*/

	/**
	* @api {post} /api/groups Insert Groups
	* @apiVersion 0.1.0
	* @apiName PostGroups
	* @apiGroup Groups
	* @apiPermission CustomAccess
	*
	* @apiDescription Insert a new Group. 
	*
	* @apiParam (Body) {Object} group Group object to be inserted.
	* @apiParam (Body) {String} group.name   Name of the Group.
	* @apiParam (Body) {String} group.description   Brief description of the Group.
	* @apiParam (Body) {Date} group.creationDate   Date of Group's creation.
	* @apiParam (Body) {Boolean}   group.isDefault   Define if it must be considered the default group for new groups.
	*
	* @apiExample Example usage:
	* curl -i https://localhost/api/groups
	*
	* @apiSuccess {Number} result ID of the inserted Group.
	*
	* @apiError Unauthorized The client is not authenticated and can't use the API.
	* @apiError Forbidden The client is authenticated but has not authorization to the requested resource.
	* @apiError LogicalError TODO Because of the platform's logic it is not possible to execute the request.
	*
	* @apiErrorExample String UnauthorizedError:
	*     HTTP/1.1 401 Unauthorized
	*		"Unauthorized"
	*
	* @apiErrorExample json ForbiddenError:
	*     HTTP/1.1 403 Forbidden
	*		{
	*			"error" : "Get out dog..."
	*		}
	*/

	/**
	* @api {put} /api/groups/:id Update a Group
	* @apiVersion 0.1.0
	* @apiName PutGroups
	* @apiGroup Groups
	* @apiPermission CustomAccess
	*
	* @apiDescription Updated the fields of a Group. 
	*
	* @apiParam (Param) {Number} id ID of the group.
	*
	* @apiParam (Body) {Object} group Group object to be inserted.
	* @apiParam (Body) {Number} group.id ID of the Group.
 	* @apiParam (Body) {String} group.name   Name of the Group.
	* @apiParam (Body) {String} group.description   Brief description of the Group.
	* @apiParam (Body) {Date} group.creationDate   Date of Group's creation.
	* @apiParam (Body) {Boolean}   group.isDefault   Define if it must be considered the default group for new groups.
	*
	* @apiExample Example usage:
	* curl -i https://localhost/api/groups/123
	*
	* @apiSuccess {Number} result TODO.
	*
	* @apiError Unauthorized The client is not authenticated and can't use the API.
	* @apiError Forbidden The client is authenticated but has not authorization to the requested resource.
	* @apiError NotFound TODO The requested ID matches with none Group on database.
	* @apiError LogicalError TODO Because of the platform's logic it is not possible to execute the request.
	*
	* @apiErrorExample String UnauthorizedError:
	*     HTTP/1.1 401 Unauthorized
	*		"Unauthorized"
	*
	* @apiErrorExample json ForbiddenError:
	*     HTTP/1.1 403 Forbidden
	*		{
	*			"error" : "Get out dog..."
	*		}
	*/

	/**
	* @api {delete} /api/groups/:id Delete a Group
	* @apiVersion 0.1.0
	* @apiName DeleteGroups
	* @apiGroup Groups
	* @apiPermission CustomAccess
	*
	* @apiDescription Remove a Group from database. 
	*
	* @apiParam (Param) {Number} id ID of the group.
	*
	* @apiExample Example usage:
	* curl -i https://localhost/api/groups/123
	*
	* @apiSuccess {Number} result TODO.
	*
	* @apiError Unauthorized The client is not authenticated and can't use the API.
	* @apiError Forbidden The client is authenticated but has not authorization to the requested resource.
	* @apiError NotFound TODO The requested ID matches with none Group on database.
	* @apiError LogicalError TODO Because of the platform's logic it is not possible to execute the request.
	*
	* @apiErrorExample String UnauthorizedError:
	*     HTTP/1.1 401 Unauthorized
	*		"Unauthorized"
	*
	* @apiErrorExample json ForbiddenError:
	*     HTTP/1.1 403 Forbidden
	*		{
	*			"error" : "Get out dog..."
	*		}
	*
	* @apiErrorExample json LogicalError:
	*     HTTP/1.1 403 TODO
	*		{
	*			"error" : "TODO"
	*		}
	*/

		/* OBJECT EXAMPLE
	    "id" = 0;
	    "rfidReadDate" = "error here";
	    "serverReceivedDate" = "error here";
	    "rfidcode" = 23423423;
	    "collectorId" = 1;
		"packageId" = 1;
	    "extraData" = "{}";
	*/

	/**
	* @api {get} /api/rfiddata Get array of Rfiddata
	* @apiVersion 0.1.0
	* @apiName GetRfiddata
	* @apiGroup Rfiddata
	* @apiPermission CustomAccess
	*
	* @apiDescription Search on platform for Rfiddata that match the given parameters. 
	*
	* @apiParam (Query) {Number={1-50}} limit=50 Defines the maximum number of register to return.
	* @apiParam (Query) {Number={1-50}} offset=0 Defines the offset of register result to return.
	*
	* @apiExample Example usage:
	* curl -i https://localhost/api/rfiddata
	*
	* @apiSuccess {Object[]} rfiddata       List of Rfiddata.
	* @apiSuccess {Number}   rfiddata.id   Platform ID of the Rfiddata.
	* @apiSuccess {Date}   rfiddata.rfidReadDate   Date when the Collector collected the data.
	* @apiSuccess {Date}   rfiddata.serverReceivedDate   Date when the Platform received the data from Collector.
	* @apiSuccess {Number}   rfiddata.rfidcode   Rfid code itself.
	* @apiSuccess {Number}   rfiddata.collectorId   ID of the collector where the data came from.
	* @apiSuccess {Number}   rfiddata.packageId   ID of the package sent by Collector containing the data.
	* @apiSuccess {Object}   rfiddata.extraData   A object sent by Collector containing custom information.
	*
	* @apiError Unauthorized The client is not authenticated and can't use the API.
	* @apiError Forbidden The client is authenticated but has not authorization to the requested resource.
	*
	* @apiErrorExample String UnauthorizedError:
	*     HTTP/1.1 401 Unauthorized
	*		"Unauthorized"
	*
	* @apiErrorExample json ForbiddenError:
	*     HTTP/1.1 403 Forbidden
	*		{
	*			"error" : "Get out dog..."
	*		}
	*/

	/**
	* @api {get} /api/rfiddata/:rfidcode Get array of Rfiddata by Rfidcode
	* @apiVersion 0.1.0
	* @apiName GetRfiddataByRfidcode
	* @apiGroup Rfiddata
	* @apiPermission CustomAccess
	*
	* @apiDescription Search on platform for Rfiddata that match the given rfidcode. 
	*
	* @apiParam (Query) {Number={1-50}} limit=50 Defines the maximum number of register to return.
	* @apiParam (Query) {Number={1-50}} offset=0 Defines the offset of register result to return.
	*
	* @apiExample Example usage:
	* curl -i https://localhost/api/rfiddata/987654321
	*
	* @apiSuccess {Object[]} rfiddata       List of Rfiddata.
	* @apiSuccess {Number}   rfiddata.id   Platform ID of the Rfiddata.
	* @apiSuccess {Date}   rfiddata.rfidReadDate   Date when the Collector collected the data.
	* @apiSuccess {Date}   rfiddata.serverReceivedDate   Date when the Platform received the data from Collector.
	* @apiSuccess {Number}   rfiddata.rfidcode   Rfid code itself.
	* @apiSuccess {Number}   rfiddata.collectorId   ID of the collector where the data came from.
	* @apiSuccess {Number}   rfiddata.packageId   ID of the package sent by Collector containing the data.
	* @apiSuccess {Object}   rfiddata.extraData   A object sent by Collector containing custom information.
	*
	* @apiError Unauthorized The client is not authenticated and can't use the API.
	* @apiError Forbidden The client is authenticated but has not authorization to the requested resource.
	*
	* @apiErrorExample String UnauthorizedError:
	*     HTTP/1.1 401 Unauthorized
	*		"Unauthorized"
	*
	* @apiErrorExample json ForbiddenError:
	*     HTTP/1.1 403 Forbidden
	*		{
	*			"error" : "Get out dog..."
	*		}
	*/

	/**
	* @api {get} /api/permissions Get List of Permissions
	* @apiVersion 0.1.0
	* @apiName GetPermissions
	* @apiGroup Permissions
	* @apiPermission AuthenticatedAccess
	*
	* @apiDescription Search on platform for resources the current Client has authorization. 
	*
	* @apiExample Example usage:
	* curl -i https://localhost/api/permissions
	*
	* @apiSuccess {Object[]} permission       List of Permissions.
	* @apiSuccess {String}   permission.route   Defines the URI path to the resource.
	* @apiSuccess {String=GET, POST, PUT, DELETE, ANY}   permission.method   Defines the methods allowed.
	*
	* @apiError Unauthorized The client is not authenticated and can't use the API.
	*
	* @apiErrorExample String UnauthorizedError:
	*     HTTP/1.1 401 Unauthorized
	*		"Unauthorized"
	*
	*/