var expect = require("chai").expect;
var ManipulateDb = require('../utils/manipulatedb');

var manipulate = new ManipulateDb();

describe("ManipulateDB", function(){
	describe("#createDefaultDataBase()", function(){
		it("should read rfidmonitor.sql and create a database", function(done){
			//TODO: Create database		
			manipulate.createDefaultDataBase("rfidplatform_test", function(err){

				if(err){
					var strErr = err.toString();
					console.log('already exists');
					expect(strErr).to.have.string('already exists');
					done();
				}else{
					expect(err).to.equals(null);
					done();
				}
			});
		});

		it("should drop the database just created", function(done){
			manipulate.dropDataBase("rfidplatform_test", function(err){

				if(err){
					var strErr = err.toString();
					console.log('does not exist');
					expect(strErr).to.have.string('does not exist');
					done();
				}else{
					expect(err).to.equals(null);
					done();
				}
			});
		});
	});
});
