var runCmd = require('./helper').runCmd

function startClearDb() {
	console.log('Starting clear Db container ..');
	return runCmd('docker', ['start','eshop2'])
	.delay(1000)
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

before(function(done) {
	this.timeout(4000);
	startClearDb()
	.then(done);
});

after(function(done) {
	stopDb()
	.then(done);
});
