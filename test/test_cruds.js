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

		var g_dao = new GroupDao();

		describe("#insert()", function(){
			it("Should return the default group. Insert if needed", function(done){
				g_dao.getDefault(function(err, resultedGroup){

					// expect(resultedGroup).to.not.equal(null);
					expect(resultedGroup).not.to.be.null;
					done();
				});
			});
		});

		describe("#update()", function(){
			it("Should do an update", function(){

			});
		});

		describe("#remove()", function(){
			it("Should do an remove", function(){

			});
		});

		describe("#find()", function(){
			it("Should do an find", function(){

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