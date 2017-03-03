var spawn = require('child_process').spawn;
var expect = require('chai').expect;
var Promise = require('bluebird');

function runCmd(cmd, args, condition) {
    var stdout = '';
    return new Promise(function(resolve, reject) {
    	var child = spawn(cmd, args);

    	function conditionHandle() {
    		condition(stdout, enough, reject)
    	}
    	
    	function enough() {
    		child.stdout.removeListener('data', conditionHandle);
    		child.stdout.removeListener('end', resolve);
    		resolve();
    	}

    	child.stdout.on('data', function(buffer) { stdout += buffer.toString() });
		if(condition) {
			child.stdout.on('data', conditionHandle);
		}
		child.stdout.on('end', resolve);
	}).then(function() {
    	return stdout;
    });
}

function deleteUser(name) {
    // delete test user manually, no deleting of users in production, no reuse of usernames
    console.log("delete user "+name);
    var db_pool = require('../app/db_pool');
    var dbconfig = require('../config/database');
    
    return db_pool.getConnection()
    .then( function(connection) {
        return connection.query("DELETE FROM `"+dbconfig.users_table+"` WHERE username = \""+name+"\";")
    })
    .then( function(result) {
        expect(result.affectedRows).to.equal(1);
    });
}

module.exports = {
	runCmd: runCmd,
    deleteUser: deleteUser
}
