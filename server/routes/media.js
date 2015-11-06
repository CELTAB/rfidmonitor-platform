'use strict';
var logger = require('winston');
var path = require('path');
var fs = require('fs');
var PlatformMedia = require(__base + 'models/platformmedia');
var appDir = path.dirname(require.main.filename);
var errorHandler = require(__base + 'utils/errorhandler');

var multer  = require('multer');
var storage = multer.diskStorage({destination: appDir + '/restricted_media/tmp/'});
var upload = multer({ storage: storage });

var getHandler = function(req, callback){
  PlatformMedia.findOne({where : { id : req.params.id }})
  .then(function(record){
    if(record){
      return callback(null, path.join(appDir, record.path), 'sendfile');
    }else{
      return errorHandler('Media Not Found', 400, callback);
    }
  })
  .catch(function(e){
    return errorHandler('Error while getting media: ' + e.toString(), 500, callback);
  });
}

var postHandler = function(req, callback){
  if(!req.file)
    return errorHandler('We didnt receive your file', 400, callback);

  var file = req.file;
  var underAppPath = '/restricted_media/media/images/' + req.file.filename;

  file.finalPath = appDir + underAppPath;
  fs.rename(req.file.path, file.finalPath, function(err){
    if (err)
      return errorHandler('Internal Error: ' + err.toString(), 500, callback);

    fs.readFile(file.finalPath, function (err, data) {
        if (err){
          return errorHandler('Error read: ' + err.toString(), 500, callback);
        }
        PlatformMedia.create(
          {
            url: file.filename,
            path : underAppPath,
            type: 'IMAGE',
            mimetype : file.mimetype
          })
        .then(function(f){
          f.url = '/api/media/'+f.id;
          f.save().then(function(f){
            return callback(null, {"mediaId" :f.id});
          }).catch(function(e){
            return errorHandler('Error: ' + e.toString(), 500, callback);
          });
        }).catch(function(e){
          return errorHandler('Error: ' + e.toString(), 500, callback);
        });
    });
  });
}

var Route = require(__base + 'utils/customroute');
var routeStr = '/media';
var routes = [
  new Route('get', routeStr + '/:id', getHandler),
  new Route('post', routeStr, postHandler, upload.single('image'))
];

module.exports = routes;
