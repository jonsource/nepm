var Promise = require('bluebird');
var request = require('request');
var expect = require('chai').expect;
var spawn = require('child_process').spawn;

function run_cmd(cmd, args) {
    var stdout = '';
    return new Promise(function(resolve, reject) {
    	var child = spawn(cmd, args);
		child.stdout.on('data', function(buffer) { stdout += buffer.toString() });
    	child.stdout.on('end', resolve);
	}).then(function() {
    	return stdout;
    });
}

describe("App server tests", function() {

	it("runs docker", function(done) {
		this.timeout(6000);
		run_cmd('docker', ['start','eshop2'])
		.then(function(result) {
			console.log('result ', result);
			run_cmd('npm',['start'])
			.then(function(result) {
				console.log(result);
				done();
			});
		});
	});
	
	var base_url = "http://localhost:3000/";
	console.log(base_url)

	it("returns status 200", function(done) {
		request(base_url, function(error, response, body) {
	    	expect(response.statusCode).to.equal(200);
	        done();
	    });
	});
});
