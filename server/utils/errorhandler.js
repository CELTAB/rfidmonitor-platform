var logger = require('winston');

var errorHandler = function(err, code, callback){
  var errMessage = {code: code, error: err, message: err};
  if(code === 500)
   logger.error(errMessage);
  return callback(errMessage);
}

module.exports = errorHandler;
