module.exports = function(migration) {

	var mysql = require('mysql');
	migration.dbconfig = require('../config/database');
	migration.dbconfig.connection.multipleStatements = true;
	migration.connection = mysql.createConnection(migration.dbconfig.connection);

	var argv = require('minimist')(process.argv.slice(2));
	
	if(argv['u'] || argv._.indexOf('up') > -1) {
		console.log('migrating up');
		migration.up();
	}

	if(argv['d'] || argv._.indexOf('down') > -1) {
		console.log('migrating down');
		migration.down();
	}

	migration.connection.end();
}
