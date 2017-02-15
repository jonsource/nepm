var mysql = require('promise-mysql');
var dbconfig = require('../config/database');

var db_pool = mysql.createPool(dbconfig.connection);
db_pool.getConnection()
.then(function(connection) {
	// ugly hack to see all MySQL queries
	connection.constructor.prototype.originalQuery = connection.constructor.prototype.query;
	connection.constructor.prototype.query = function(str) {
		console.log('query', str);
		return connection.constructor.prototype.originalQuery.call(this, str);
	}
	
	connection.query( 'SELECT * FROM `' + dbconfig.users_table + '` LIMIT 1')
	.then( function(rows) {
   		console.log('Connected to db ' + dbconfig.connection.database + ' at ' + dbconfig.connection.host + ':' + dbconfig.connection.port + ' .. OK');
   		if(rows.length) {
   			console.log('Found at least one user .. OK');
   		}
   		//TODO: create default admin user if not found
  	});
});

module.exports = db_pool;
