var spawn = require('child_process').spawn;
var Promise = require('bluebird');

function runCmd(cmd, args, condition) {
    var stdout = '';
    return new Promise(function(resolve, reject) {
    	var child = spawn(cmd, args);
		child.stdout.on('data', function(buffer) { stdout += buffer.toString() });
		if(condition) {
			child.stdout.on('data', function() { condition(stdout, resolve, reject) });
		}
		child.stdout.on('end', resolve);
	}).then(function() {
    	return stdout;
    });
}

module.exports = {
	runCmd: runCmd
}
