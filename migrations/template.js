var mysql = require('mysql');
var dbconfig = require('../config/database');
dbconfig.connection.multipleStatements = true;
var connection = mysql.createConnection(dbconfig.connection);

exports.up = function(next){
	next();
};

exports.down = function(next){
	next();
};