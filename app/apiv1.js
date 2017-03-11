var Promise = require('bluebird');
var express = require('express');
var authentication = require('./authentication');
var restRouter = require('./rest_router');

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

	router.post('/create_order', function(req, res, next) {
		console.log('create', req.body.order);
		var i=0;
		var products=[];
		Promise.map(req.body.order, function() {
			var itemData = req.body.order[i];
			console.log('item_data', itemData);
			return models.product.findOneBy('id', itemData.product_id)
			.then(function(product) {
				
				/*return product.get('variants.options')
				.then(function() {
					return product;	
				})*/
				return product;
			});
		})
		.then(function(result) {
			console.log('product', result);
			res.json({order: 'created', items: result});
		});
	});

	for(model in models) {
		if(models.hasOwnProperty(model)) {
			router.use('/', restRouter('/'+models[model].schema.plural, models[model]));
		}
	}

	
	/* Uploading files */

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