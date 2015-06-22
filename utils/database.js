var pg = require('pg');
var logger = require('winston');

var connectionString = 'postgres://rfidplatform:rfidplatform@localhost:5432/rfidplatform';

logger.info("DB connection string: " + connectionString);

module.exports = {
   query: function(text, values, cb) {
      pg.connect(connectionString, function(err, client, done) {
      	if (err)
      		cb(err, null);
        else
          client.query(text, values, function(err, result) {
            done();
            cb(err, result);
          })
      });
   }
}

