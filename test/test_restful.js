var https = require('https');
var expect = require("chai").expect;

var resObj = {chapei:"get"};

      var options = {
        hostname: '127.0.0.1',
        port: 443,
        path: '/api/numsei',
        method: 'GET',
        rejectUnauthorized:false
      };

describe("Services", function(){
  describe("#api", function(){
    it("Should access the api", function(done){
      var req = https.request(options, function(res) {

         expect(res.statusCode).to.deep.equals(200);
         done();
      });

      req.end();
    });

    it("Should return 'Chapei' object", function(done){
      var req = https.request(options, function(res) {
         
        res.on('data', function(data){
          var a = JSON.parse(data);
          expect(a).to.deep.equals(resObj);
          done();
        });
      });

      req.end();
    });

  });
});



