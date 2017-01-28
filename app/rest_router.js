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

	router.get(path, function(req, res, next) {
		console.log("model", model);
		model.find()
		.then(function(results) {
			res.json(response(results));
		})
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
					model.findBy('id',req.params.id)
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
		model.findBy('id',req.params.id)
		.then(function(results) {
			res.json(response(results));
		})
	});

	router.get(path+'/:id/prdel', function(req, res, next) {
		res.json("zlo");
	});

    router.put(path+'/:id', function(req, res, next) {
		var id = req.params.id
		model.findBy('id', id)
		.then(function(results) {
			if(!results) {
				res.json({products:[], error: schema.name+' '+id+' not found'});
			}
			return results[0].update(JSON.parse(req.body[schema.name]));
		})
		.then(function() {
			return model.findBy('id', id);
		})
		.then(function(results) {
			res.json(response(results));
		});
	});

	router.delete(path+'/:id', function(req, res, next) {
		var id = req.params.id
		model.findBy('id', id)
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
