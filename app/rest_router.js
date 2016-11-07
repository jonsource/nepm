var express = require('express');

module.exports = function(path, model) {

	var router = express.Router({mergeParams: true});
	var schema = model.schema;

	function response(results, other) {
		var ret = other || {};
		ret[schema.plural] = results;
		return ret;
	}

	router.get(path, function(req, res, next) {
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

	router.get(path+'/:id', function(req, res, next) {
		model.findBy('id',req.params.id)
		.then(function(results) {
			res.json(response(results));
		})
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
