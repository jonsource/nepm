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

describe("Simple authentication tests", function() {
	var base_url = "http://localhost:3000/";
	var session = '';

	/*after(function(done) {
		console.log('deleting user krtek2');
		request({uri:base_url + 'profile',followRedirect:false, headers:{cookie:'connect.sid='+session}},
			function(error, response, body) {
	    	expect(response.statusCode).to.equal(200);
	    	done();
	    });
	});*/

	it("profile inaccessible", function(done) {
		request({uri:base_url + 'profile',followRedirect:false},
			function(error, response, body) {
	    	expect(response.statusCode).to.equal(302);
	    	expect(response.headers.location).to.equal('/');
	        done();
	    });
	});

	it("create user", function(done) {
		request({method:'post', uri:base_url + 'signup',followRedirect:false, form:{username:'krtek2', password:'evilkrtek'}},
			function(error, response, body) {
	    	expect(response.statusCode).to.equal(302);
	    	expect(response.headers.location).to.equal('/profile');
	    	session = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
	    	done();
	    });
	});

	it("profile accessible", function(done) {
		request({uri:base_url + 'profile',followRedirect:false, headers:{cookie:'connect.sid='+session}},
			function(error, response, body) {
	    	expect(response.statusCode).to.equal(200);
	    	done();
	    });
	});

});
