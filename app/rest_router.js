var express = require('express');
var promise = require('bluebird');

module.exports = function(path, model, parent) {

	var router = express.Router({mergeParams: true});
	var schema = model.schema;

	function json_data(req, res, next) {
		//console.log("json_data");
		var ret={};
		ret[res.api_response.name] = res.api_response.results;
		res.json(ret);
	}

	function lazy_load_mw(req, res, next) {
		console.log("lazy_load_mw");

		function lazy_load_chain(chain, object) {
			//console.log('lazy_load_chain', chain);
			var parts = chain.split('.');
			var property = parts.shift();
			chain = parts.join('.');
			if(chain) {
				return object.get(property)
				.then(function() {
					return promise.map(object.data[property], function(loaded_property) {
						return lazy_load_chain(chain, loaded_property);
					});
				})
			}
			else {
				return object.get(property)
			}
		}
		
		var lazy_load = [];
		if(req.query.load) {
			lazy_load = req.query.load.split(',');
		} else {
			next();
		}
		
		promise.map(res.api_response.results, function(object) {
			return promise.map(lazy_load, function(chain) {
				return lazy_load_chain(chain, object);
			})
		})
		.then(function() {
			next();
		})
		.catch(function(err) {
			console.log('err ', err);
			res.status(404);
			res.json({name: err.name, message:err.message});
		});
	}

	function shift_data_up(object) {
		var short_object = object;
		if(object.data && object.schema) {
			object = object.data;
			short_object = {id:object.id, name: object.name};
		}
		for (var child in object) {
			if(object.hasOwnProperty(child) && object[child] && typeof object[child] === 'object') {
				//console.log('shifting '+child);
				short_object[child] = shift_data_up(object[child]);
			}
		}
		return short_object;
	}

	function shorten_output(req, res, next) {
		//console.log("shorten_output");
		if(!req.query.hasOwnProperty('v')) {
			res.api_response.results = shift_data_up(res.api_response.results);
		}
		next();
	}

	router.use(path, function(req, res, next) {
		console.log("api_response");
		res.api_response = {};
		res.api_response.results = {};
		res.api_response.name = schema.plural;
		next();
	});

	router.get(path, function(req, res, next) {
		console.log("get");
		model.find()
		.then(function(result){
			res.api_response.results = result;
			next();
		});
	}, lazy_load_mw, shorten_output, json_data);

	router.get(path+'/:id', function(req, res, next) {
		model.find_by('id',req.params.id)
		.then(function(result){
			res.api_response.results = result;
			next();
		});
	}, lazy_load_mw, shorten_output, json_data);

	router.post(path, function(req, res, next) {
		model.create(JSON.parse(req.body[schema.name]))
		.then(function(results) {
			console.log(results)
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
			return model.find_by('id', id);
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
