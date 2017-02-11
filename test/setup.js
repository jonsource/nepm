var runCmd = require('./helper').runCmd

before(function(done) {
	//describe('before all tests', function() { 
		it('runs mysql docker and server.js', function(done) {
			this.timeout(4000);
			runCmd('docker', ['start','eshop2'])
			.then(function(result) {
				console.log('result ', result);
				runCmd('npm',['start'],
					function(stdout, resolve, reject) {
						var lines = stdout.split('\n');
						var ok = false;
						for(var i = 0; i<lines.length; i++) {
							if(lines[i] == 'Connected to db test at 172.17.0.2:3306 .. OK')
							{
								ok = true;
								break;
							}
						}
						if(ok) {
							resolve();
						}
				})
				.then(function(result) {
					console.log(result);
					done();
				});
			});
		});
	//})
	done();
});
