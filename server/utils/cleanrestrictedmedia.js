'use strict';
var logger = require('winston');
var fs = require('fs');
var path = require('path');
var appDir = path.dirname(require.main.filename);
var cleanRestrictedMediaTmpSync = function(){
	var dir = appDir + '/restricted_media/tmp/';

	fs.readdir(dir, function(err, files){
		if(err)
			return err;

		for(var i in files){
			var f = files[i];
			if(f != 'sample'){
				var finalPath = dir + f;
				logger.debug('Deleting file : ' + finalPath);
				try{
					fs.unlinkSync(finalPath);
				}catch(e){
					logger.error("Error while deleting file: " + finalPath + ". Error : " + e );
					return e;
				}
			}
		}
		return null; // sucess
	});
};

module.exports = cleanRestrictedMediaTmpSync;
