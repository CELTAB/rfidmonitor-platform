/****************************************************************************
**
** Copyright (C) 2015
**                     Gustavo Valiati <gustavovaliati@gmail.com>
**                     Thiago R. M. Bitencourt <thiago.mbitencourt@gmail.com>
**
** This file is part of the FishMonitoring project
**
** This program is free software; you can redistribute it and/or
** modify it under the terms of the GNU General Public License
** as published by the Free Software Foundation; version 2
** of the License.
**
** This program is distributed in the hope that it will be useful,
** but WITHOUT ANY WARRANTY; without even the implied warranty of
** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
** GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License
** along with this program; if not, write to the Free Software
** Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
**
****************************************************************************/

'use strict';
var logger = require('winston');
var path = require('path');
var fs = require('fs');
var PlatformMedia = require(__base + 'models/platformmedia');
var appDir = path.dirname(require.main.filename);
appDir = appDir + "/server";
var errorHandler = require(__base + 'utils/errorhandler');

var multer  = require('multer');
var storage = multer.diskStorage({destination: appDir + '/restricted_media/tmp/'});
var upload = multer({ storage: storage });

var importMedia = function(req, type, mediaPath, callback) {
  if(!req.file)
    return errorHandler('We didnt receive your file', 400, callback);

    var file = req.file;
    var lastIndexExt = file.originalname.lastIndexOf('.');

    var fileExt = null;
    if(lastIndexExt >= 0){
      fileExt = file.originalname.substring(lastIndexExt);
    }
    var fileFinalName = file.filename + fileExt;
    var underAppPath = '/restricted_media/media/' + mediaPath + '/' + fileFinalName;

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
              url: fileFinalName,
              path : underAppPath,
              type: type,
              mimetype : file.mimetype
            })
          .then(function(f){
            f.url = '/api/media/'+f.uuid;
            f.save().then(function(f){
              return callback(null, {mediaId :f.uuid, file: data});
            }).catch(function(e){
              return errorHandler('Error: ' + e.toString(), 500, callback);
            });
          }).catch(function(e){
            return errorHandler('Error: ' + e.toString(), 500, callback);
          });
      });
    });
}

var getHandler = function(req, callback){
  PlatformMedia.findOne({where : { uuid : req.params.id }})
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
  importMedia(req, 'IMAGE', 'image' ,function(err, result) {
    if (err) return callback(err);

    callback(null, {mediaId: result.mediaId});
  });
}

var importHandler = function(req, callback) {
  importMedia(req, 'RFID_IMPORT', 'rfid_import' ,function(err, result) {
    if (err) return callback(err);

    var parsedData = null;
    try{
    	parsedData = JSON.parse(result.file);
    }catch(e){
      return errorHandler('The file format is incorrect. Error: ' + e.toString(), 400, callback);
    }

    logger.warn('todo : REGISTER on database the file info.');
    var Rfid = require(__base + 'controller/models/rfiddata');
    Rfid.bulkSave(parsedData, function(err, result) {
      if (err) return errorHandler(err, 400, callback);

      return callback(null, result);
    });
  });
};

var Route = require(__base + 'utils/customroute');
var routeStr = '/media';
var routes = [
  new Route('get', routeStr + '/:id', getHandler),
  new Route('post', routeStr, postHandler, upload.single('image')),
  new Route('post', '/import', importHandler, upload.single('rfidimport')),
];

module.exports = routes;
