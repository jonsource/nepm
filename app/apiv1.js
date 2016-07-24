var express = require('express');
var authentication = require('./authentication');

module.exports = function(passport) {
	
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

	router.get('/products', function(req, res, next) {
		console.log(req.app.models);
		req.app.models.product.get()
		.then(function(results) {
			res.json({products: results});
		})
	});

	router.post('/products/', function(req, res, next) {
		console.log(req.body.product);
		req.app.models.product.create(JSON.parse(req.body.product))
		.then(function(results) {
			console.log(results)
			res.json({products: results, success: true});
		});
	});

	router.get('/products/:id', function(req, res, next) {
		req.app.models.product.findBy('id',req.params.id)
		.then(function(results) {
			res.json({products: results});
		})
	});

	router.put('/products/:id', function(req, res, next) {
		var id = req.params.id
		req.app.models.product.findBy('id', id)
		.then(function(result) {
			if(!result) {
				res.json({products:[], error:'Product '+id+' not found'});
			}
			console.log('put', req.body.product);
			return result.update(req.body.product);
		})
		.then(function() {
			return req.app.models.product.findBy('id', id);
		})
		.then(function(results) {
			res.json({products: results, success: true});
		});
	});

	router.delete('/products/:id', function(req, res, next) {
		var id = req.params.id
		req.app.models.product.findBy('id', id)
		.then(function(result) {
			if(!result) {
				res.json({products:[], error:'Product '+id+' not found'});
			}
			console.log('delete');
			return result.delete();
		})
		.then(function() {
			return req.app.models.product.findBy('id', id);
		})
		.then(function(results) {
			if(!results)
			{
				res.json({products: results, success: true});
			} else {
				res.json({products: results, error: "Failed to delete product "+id});
			}
		});
	});

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
	
	return {
		router: router
	}
}