var mysql = require('mysql');
var dbconfig = require('../config/database');
var Promise = require('bluebird');
dbconfig.connection.multipleStatements = true;
var db = dbconfig.connection.database;
delete dbconfig.connection.database;
var connection;
var connect;
var q;
var query = function(str) {
				console.log('generating', str)
				return function() {
					console.log('performing', str);
					return q(str);
				}
			}

//var async = require('async');

var attempt = 0;

function tryConnect() {
		console.log("Trying connection ", attempt++)
		connection = mysql.createConnection(dbconfig.connection);
		connect = Promise.promisify(connection.connect, {context: connection});
		return connect()
		.catch(function(err) {
			if(attempt<150) {
				return Promise.delay(200).then(tryConnect); 
			}
			else throw(err);
		});
	};

function getConnect() {
	if(connection) {
		return Promise.resolve(connection);
	}
	return tryConnect()
	.then(function() {
		console.log('after connect');
		q = Promise.promisify(connection.query, {context: connection});
		dbconfig.connection.database = db
	})
}

module.exports = {  getConnect: getConnect,
					query: query
				 }