var runCmd = require('./helper').runCmd;
var request = require('request');
var expect = require('chai').expect;

function startClearDb() {
	console.log('Starting clear Db container ..');
	return runCmd('docker', ['start','eshop2'])
	.delay(1500)
	.then(function(result) {
		console.log('Db container started ..');
	});
}

function stopDb() {
	return runCmd('docker', ['kill','eshop2'])
	.then(function(result) {
		console.log('.. Db container killed');
	});
}

function deleteUser() {
	// delete test user manually, no deleting of users in production, no reuse of usernames
	console.log("delete user krtek2");
	var db_pool = require('../app/db_pool');
	var dbconfig = require('../config/database');
	
	return db_pool.getConnection()
	.then( function(connection) {
		return connection.query("DELETE FROM `"+dbconfig.users_table+"` WHERE username = \"krtek2\";")
	})
	.then( function(result) {
		expect(result.affectedRows).to.equal(1);
	});
}

before(function(done) {
	this.timeout(4000);
	startClearDb()
	.then(done);
});

after(function(done) {
	deleteUser()
	.then(stopDb)
	.then(done);
});
