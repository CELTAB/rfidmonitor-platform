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

		// describe("#insert()", function(){
		// 	it("should insert an GET Method record", function(done){

		// 		mDao.insert("GET", function(err, methodId){

		// 			inserterId = methodId;
		// 			expect(inserterId).to.be.int;

		// 			g_routerAccess.methodId = inserterId;
		// 			done();
		// 		});
		// 	});
		// });

		// describe("#getMethodById()", function(){
		// 	it("should find the GET method", function(done){

		// 		mDao.getMethodById(inserterId, function(err, foundMethod){
		// 			expect(foundMethod.id).to.equal(inserterId);
		// 			done();
		// 		});
		// 	});
		// });
	});


	describe("UriRoutersDao", function(){

		var routerDao = require('../dao/uriroutersdao');
		var rDao = new routerDao();

		var inserterId;

		describe("#insert()", function(){
			it("should insert an URIRouter record", function(done){

				rDao.insert("/api/users", function(err, routeId){

					inserterId = routeId;
					expect(inserterId).to.be.int;

					g_routerAccess.uriId = inserterId;
					done();
				});
			});
		});

		describe("#getRouteById()", function(){
			it("should find the /api/users/ route", function(done){

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

					g_routerAccess.methodId = inserterId;
					done();
				});
			});
		});

		describe("#getMethodById()", function(){
			it("should find the GET method", function(done){

				mDao.getMethodById(inserterId, function(err, foundMethod){
					expect(foundMethod.id).to.equal(inserterId);
					done();
				});
			});
		});
	});

	describe("RouterAccessDAO", function(){

		var RouterAccessDAO = require('../dao/routeraccessdao');

		var rDao = new RouterAccessDAO();
		describe("#getAccess()", function(){
			it("should get access to the rout /api/users with GET method", function(done){

				var obj = {
					clientId: 1,
					route: "/api/users",
					methodName: "GET"
				};

				rDao.getAccess(obj, function(err, result){
					expect(result).to.deep.equal(obj);
					done();
				});
			});

			it("should not get access to the rout /api/users with POST method", function(done){

				var obj = {
					clientId: 1,
					route: "/api/users",
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