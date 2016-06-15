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
	
	return {
		router: router
	}
}