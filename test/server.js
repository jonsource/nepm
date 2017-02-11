var Promise = require('bluebird');
var request = require('request');
var expect = require('chai').expect;

describe("App server tests", function() {

	var base_url = "http://localhost:3000/";
	console.log(base_url)

	it("returns status 200", function(done) {
		request(base_url, function(error, response, body) {
	    	expect(response.statusCode).to.equal(200);
	        done();
	    });
	});
});
