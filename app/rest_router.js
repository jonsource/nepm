var express = require('express');
var promise = require('bluebird');

module.exports = function(path, model, parent) {

	var router = express.Router({mergeParams: true});
	var schema = model.schema;

	function response(results, other, name) {
		var ret = other || {};
		if(!name) name = schema.plural;
		ret[name] = results;
		return ret;
	}

	function lazy_load_properties(results, req) {
		var lazy_load = [];
		if(req.query.load) {
			lazy_load = req.query.load.split(',');
		}
		return promise.map(results, function(result) {
   		 	return promise.map(lazy_load, function(property) {
    			return result.get(property);
    		});
		})
	}

	router.get(path, function(req, res, next) {
		var objects;
		model.find()
		.then(function(results) {
			objects = results;
			return lazy_load_properties(results, req);
		})
		.then(function(results) {
			res.json(response(objects));
		});
	});

	router.post(path, function(req, res, next) {
		model.create(JSON.parse(req.body[schema.name]))
		.then(function(results) {
			console.log(results)
			res.json(response(results));
		});
	});


	if(schema && schema.joins) {
		var joins = schema.joins;
		for (var join_name in schema.joins) {
			if(joins.hasOwnProperty(join_name) && joins[join_name].model) {
				var join = schema.joins[join_name];
				console.log("model.joins["+join_name+"]");
				//router.get(path+'/:id', require('./rest_router')(path+'/:id/'+join.model.plural, join.model));
					router.get(path+'/:id/'+join_name, function(req, res, next) {
					model.find_by('id',req.params.id)
					.then(function(results) {
						promise.mapSeries(results, function(val) {
							return val.get(join_name);
						})
						.then(function(results) {
							res.json(response(results, null, join_name));
						})
					})
				});
			}
		}
	}

	router.get(path+'/:id', function(req, res, next) {
		model.find_by('id',req.params.id)
		.then(function(results) {
			res.json(response(results));
		})
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
