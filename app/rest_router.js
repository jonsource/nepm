var express = require('express');
var authentication = require('./authentication');
var promise = require('bluebird');
var log = require('debug')('nepm:rest_router');
var cors = require('cors');

module.exports = function(path, model, parent) {

	var router = express.Router({mergeParams: true});
	var schema = model.schema;

	function jsonData(req, res, next) {
		var ret={};
		ret = res.api_response.results;
		log("jsonData", ret);
		res.json(ret);
	}

	function lazyLoad(req, res, next) {
		var lazy_load = [];
		if(!req.query.load) {
			next();
		} else {
			promise.map(res.api_response.results, function(object) {
				return object.getByChain(req.query.load);
			})
			.then(function() {
				next();
			})
			.catch(function(err) {
				log('err ', err);
				res.status(404);
				res.json({name: err.name, message:err.message});
				throw err;
			});
		}
	}

	function shiftDataUp(object) {
		var short_object = object;
		if(object.data && object.schema) {
			short_object = object.data;
			delete short_object.deleted;
		}
		for (var child in short_object) {
			if(object.hasOwnProperty(child) && object[child] && typeof object[child] === 'object') {
				log('shifting '+child);
				short_object[child] = shiftDataUp(object[child]);
			}
		}
		return short_object;
	}

	function shortenOutput(req, res, next) {
		if(!req.query.hasOwnProperty('v')) {
			res.api_response.results = shiftDataUp(res.api_response.results);
		}
		next();
	}

	router.use(path, cors(), function(req, res, next) {
		log("api_response");
		res.api_response = {};
		res.api_response.results = {};
		res.api_response.name = schema.plural;
		next();
	});

	router.get(path, function(req, res, next) {
		if(model.schema.protected) {
			log('protected route authenticating');
			authentication.isLoggedInJwt(req, res, next);
		} else {
			next();
		}
	});

	router.get(path, function(req, res, next) {
		log("get");
		model.find()
		.then(function(result){
			res.api_response.results = result;
			next();
		});
	}, lazyLoad, shortenOutput, jsonData);

	router.get(path+'/:id', function(req, res, next) {
		model.findBy('id',req.params.id)
		.then(function(result){
			res.api_response.results = result;
			next();
		});
	}, lazyLoad, shortenOutput, jsonData);

	router.post(path, function(req, res, next) {
		model.create(JSON.parse(req.body[schema.name]))
		.then(function(results) {
			log(results)
			res.json(response(results));
		});
	});

	router.put(path+'/:id', function(req, res, next) {
		var id = req.params.id
		model.find_by('id', id)
		.then(function(results) {
			if(!results) {
				res.json({products:[], error: schema.name+' '+id+' not found'});
			}
			return results[0].update(JSON.parse(req.body[schema.name]));
		})
		.then(function() {
			return model.find_by('id', id);
		})
		.then(function(results) {
			res.json(response(results));
		});
	});
 
	router.delete(path+'/:id', function(req, res, next) {
		var id = req.params.id
		model.find_by('id', id)
		.then(function(results) {
			if(!results) {
				res.json(response(results, {error: schema.name+' '+id+' not found'}));
			}
			return results[0].delete();
		})
		.then(function() {
			return model.findBy('id', id);
		})
		.then(function(results) {
			if(!results)
			{	res.json(response(results));
			} else {
				res.json(response(results, {error: 'Failed to delete '+schema.name+' '+id}));
			}
		});
	});

	return router;
}
