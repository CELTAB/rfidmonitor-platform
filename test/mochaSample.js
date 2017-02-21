//TODO remove. Not used.

'use strict';
var expect = require("chai").expect;
describe("Your Main test description", function(){
  describe("Sub-test level 1", function(){
    describe("#test 1", function(){
			it("Should match your test with the expect result", function(/*done*/){
          //Make your function calls and validations here.
          var value = 10;
          expect(value).to.be.int;
					// done(); //Use callback for assynchronous tests
			});
      //Make any others validations here
		});
    //Other test levels goes here
	});
});
