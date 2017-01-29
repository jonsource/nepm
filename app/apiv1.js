var express = require('express');
var authentication = require('./authentication');

module.exports = function(models) {
	
	var router = express.Router({mergeParams: true});

	router.use('/', function(req, res, next) {
		if( req.method != 'GET') {
			console.log('authenticating');
			authentication.isLoggedInJson(req, res, next);
		} else {
			next();
		}
	});

	router.get('/users', function(req, res, next) {
		res.json({users: true});
	});

	for(model in models) {
		if(models.hasOwnProperty(model)) {
			router.use('/', require('./rest_router')('/'+models[model].schema.plural, models[model]));
		}
	}
	
	var multer = require('multer');
	var storage = multer.diskStorage({
  			destination: function (req, file, callback) {
    		callback(null, './uploads');
  		},
  			filename: function (req, file, callback) {
    		callback(null, file.originalname + '-' + Date.now());
  		}
	});
	var upload = multer({ storage : storage}, {limits : {fileSize : 4*1000*1000}}).single('upload');

	router.post('/upload', function(req, res, next) {
		upload(req,res,function(err) {
	        if(err) {
	        	console.log(err);
	            return res.json({error: "Error uploading file."});
	        }
	        console.log(req.files);
	        res.json({success: true});
	    });
	});
	
	return router;
}