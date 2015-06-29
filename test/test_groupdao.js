var expect = require("chai").expect;
var GroupDao = require("../dao/groupdao");
var Group = require("../models/group");
var PlatformError = require('../utils/platformerror');

//Create a temporary database to run all this tests and then drop the tmp data base.


/*
describe("GroupDao", function(){
	describe("#insert()", function(){
		it("should insert a group with default values and return the id", function(done){

			var dao = new GroupDao();
			var group = new Group();

			group.name = 'teste_name';

			dao.insert(group, function(err, insertedId){

				expect(insertedId).to.not.equals(null);
				done();
			});
		});

		it("Should return null for duplicate key value for uq_isdefault", function(done){
			var dao = new GroupDao();
			var group = new Group();

			group.isdefault = true;

			dao.insert(group, function(err, insertedId){

				expect(insertedId).to.equals(null);
				done();
			});
		});

		it("Should thrown an error constructor called without 'new' operator", function(done){
			var dao = new GroupDao();
			var group;
			var error = null;

			try{
				dao.insert(group, function(err, insertedId){
					// expect(insertedId).to.equals(null);
				});

			}catch(err){
				error = err;
			}

			expect(error).to.be.an.instanceof(Error);
			done();
		});


		//throw error if inserting group containing an valid id. this should update not insert.
		//throw error if inserting group with default field as false. Should be null or true.
	});
});
*/

