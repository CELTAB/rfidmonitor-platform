var expect = require("chai").expect;
var ManipulateDb = require('../utils/manipulatedb');

var CollectorDao = require('../dao/collectordao');
var Collector = require('../models/collector');

var GroupDao = require('../dao/groupdao');
var Group = require('../models/group');

var PackageDao = require('../dao/packagedao');
var Package = require('../models/package');

var RfiddataDao = require('../dao/rfiddatadao');
var Rfiddata = require('../models/rfiddata');

var manipulate = new ManipulateDb();

//Global variables
var g_routerAccess = {};

describe("Data Acces Object - DAO", function(){

	// TMP - DON'T REMOVE
	// before(function(){
	// 	console.log("Executing before function");
	// 	manipulate.createDefaultDataBase("rfidplatform_test", function(err){
	// 		if(err){
	// 			var strErr = err.toString();
	// 			console.log(strErr);
	// 		}
	// 	});
	// });

	// after(function(){
	// 	console.log("Executing after function");
	// 	manipulate.dropDataBase("rfidplatform_test", function(err){
	// 		if(err){
	// 			var strErr = err.toString();
	// 			console.log(strErr);
	// 		}
	// 	});
	// });

	describe("GroupDao", function(){

		var gDao = new GroupDao();

		describe("#insert()", function(){
			it("Should return the default group. Insert if needed", function(done){
				gDao.getDefault(function(err, resultedGroup){

					// expect(resultedGroup).to.not.equal(null);
					expect(resultedGroup).not.to.be.null;
					done();
				});
			});
		});

		// describe("#update()", function(){
		// 	it("Should do an update", function(){

		// 	});
		// });

		// describe("#remove()", function(){
		// 	it("Should do an remove", function(){

		// 	});
		// });

		// describe("#find()", function(){
		// 	it("Should do an find", function(){

		// 	});
		// });

	});

	describe("AppClientDao", function(){

		var AppClientDao = require('../dao/appclientdao');
		var aDao = new AppClientDao();

		var inserterId;

		describe("#insert()", function(){
			it("should insert an appClient", function(done){

				var appC = require('../models/appclient');

				var client = new appC();

				client.authSecret = "mySecret";
				client.clientName = "thiago";

				aDao.insert(client, function(err, clientId){

					inserterId = clientId;
					expect(inserterId).to.be.int;

					g_routerAccess.clientId = inserterId;
					done();
				});
			});
		});

		describe("#insertToken", function(){
			it("should insert an token", function(done){

				var TokenDao = require('../dao/accesstokendao');
				var tDao = new TokenDao();

				tDao.insert({value: "thiagoaccesstoken", appClientId: g_routerAccess.clientId}, function(err, tokenId){
					expect(tokenId).to.be.int;
					done();
				});
			});
		});
	});


	describe("UriRoutersDao", function(){

		var routerDao = require('../dao/uriroutersdao');
		var rDao = new routerDao();

		var inserterId;

		describe("#insert()", function(){
			it("should insert an URIRouter record", function(done){

				rDao.insert("/admin/clients", function(err, routeId){

					inserterId = routeId;
					expect(inserterId).to.be.int;

					g_routerAccess.uriId = inserterId;
					done();
				});
			});
		});

		describe("#getRouteById()", function(){
			it("should find the /admin/clients route", function(done){

				rDao.getRouteById(inserterId, function(err, foundRoute){
					expect(foundRoute.id).to.equal(inserterId);
					done();
				});
			});
		});
	});

	describe("AccessMethodsDao", function(){

		var AccessMethodsDao = require('../dao/accessmethodsdao');
		var mDao = new AccessMethodsDao();

		var inserterId;

		describe("#insert()", function(){
			it("should insert an GET Method record", function(done){

				mDao.insert("GET", function(err, methodId){

					inserterId = methodId;
					expect(inserterId).to.be.int;

					g_routerAccess.methodGetId = inserterId;
					done();
				});
			});

			it("should insert an POST Method record", function(done){

				mDao.insert("POST", function(err, methodId){

					inserterId = methodId;
					expect(inserterId).to.be.int;

					g_routerAccess.methodPostId = inserterId;
					done();
				});
			});
		});

		describe("#getMethodById()", function(){
			it("should find the POST method", function(done){

				mDao.getMethodById(g_routerAccess.methodPostId, function(err, foundMethod){
					expect(foundMethod.id).to.equal(inserterId);
					done();
				});
			});
		});
	});

	describe("RouterAccessDAO", function(){

		var RouterAccessDAO = require('../dao/routeraccessdao');

		var rDao = new RouterAccessDAO();

		describe("#insert()", function(){
			it("should insert permission for router /admin/clients for access with GET", function(done){

				var RouterAccess = require('../models/routeraccess');
				var ra = new RouterAccess();

				ra.appClientId = 1;
				ra.accessMethodId = 1;
				ra.uriRouterId = g_routerAccess.uriId;

				console.log("AQUII GENTE >>>>>> " + JSON.stringify(ra, null, '\t'));

				rDao.insert(ra, function(err, accessId){

					inserterId = accessId;
					expect(accessId).to.be.int;

					g_routerAccess.accessId = accessId;
					done();
				});
			});

			it("should insert permission for router /admin/clients for access with POST", function(done){

				var RouterAccess = require('../models/routeraccess');
				var ra = new RouterAccess();

				ra.appClientId = 1;
				ra.accessMethodId = 2;
				ra.uriRouterId = g_routerAccess.uriId;

				rDao.insert(ra, function(err, accessId){

					inserterId = accessId;
					expect(accessId).to.be.int;

					g_routerAccess.accessId = accessId;
					done();
				});
			});
		});

		describe("#getAccess()", function(){
			it("should get access to the rout /admin/clients with GET method", function(done){

				var obj = {
					clientId: g_routerAccess.clientId,
					route: "/admin/clients",
					methodName: "GET"
				};

				rDao.getAccess(obj, function(err, result){
					expect(result).to.deep.equal(obj);
					done();
				});
			});

			it("should get access to the rout /admin/clients with POST method", function(done){

				var obj = {
					clientId: 1,
					route: "/admin/clients",
					methodName: "POST"
				};

				rDao.getAccess(obj, function(err, result){
					expect(result).to.be.null;
					done();
				});
			});
		});
	});

	// describe("CollectorDao", function(){
	// 	describe("#insert()", function(){
	// 		it("Should do an insert", function(){

	// 		});
	// 	});

	// 	describe("#update()", function(){
	// 		it("Should do an update", function(){

	// 		});
	// 	});

	// 	describe("#remove()", function(){
	// 		it("Should do an remove", function(){

	// 		});
	// 	});

	// 	describe("#find()", function(){
	// 		it("Should do an find", function(){

	// 		});
	// 	});
	// });

	// describe("PackageDao", function(){

	// 	describe("#insert()", function(){
	// 		it("Should do an insert", function(){

	// 		});
	// 	});

	// 	describe("#update()", function(){
	// 		it("Should do an update", function(){

	// 		});
	// 	});

	// 	describe("#remove()", function(){
	// 		it("Should do an remove", function(){

	// 		});
	// 	});

	// 	describe("#find()", function(){
	// 		it("Should do an find", function(){

	// 		});
	// 	});

	// });

	// describe("RfiddataDao", function(){

	// 	describe("#insert()", function(){
	// 		it("Should do an insert", function(){

	// 		});
	// 	});

	// 	describe("#update()", function(){
	// 		it("Should do an update", function(){

	// 		});
	// 	});

	// 	describe("#remove()", function(){
	// 		it("Should do an remove", function(){

	// 		});
	// 	});

	// 	describe("#find()", function(){
	// 		it("Should do an find", function(){

	// 		});
	// 	});

	// });
});