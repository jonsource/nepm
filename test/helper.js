var spawn = require('child_process').spawn;
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

module.exports = {
	runCmd: runCmd
}
