var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('openssl/server.key-withoutpass'),
  cert: fs.readFileSync('openssl/server.crt'),
};

https.createServer(options, function (req, res) {
  res.writeHead(200);
  res.end("hello world\n");
}).listen(8443);