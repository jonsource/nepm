var mysql = require('mysql');
var dbconfig = require('../config/database');
dbconfig.connection.multipleStatements = true;
var connection = mysql.createConnection(dbconfig.connection);
var async = require('async');

exports.up = function(next){
  	
  	async.series([
  		function(callback) {
			connection.query('\
				CREATE TABLE `tag` (\
					`id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,\
					`name` VARCHAR(64) NOT NULL,\
					`parent_tag_id` INTEGER NULL DEFAULT NULL,\
					PRIMARY KEY (`id`)\
			)', callback);
		},
		function(callback) { 
			connection.query('\
				CREATE TABLE `product_has_tag` (\
						`product_id` INTEGER NULL DEFAULT NULL,\
						`tag_id` INTEGER NULL DEFAULT NULL,\
						PRIMARY KEY (`product_id`, `tag_id`)\
			)', callback);
		},
		function(callback) { 
			connection.query('\
				ALTER TABLE `product_has_tag` ADD FOREIGN KEY (product_id) REFERENCES `product` (`id`);\
				ALTER TABLE `product_has_tag` ADD FOREIGN KEY (tag_id) REFERENCES `tag` (`id`);\
			', callback);
		}],
		function(err, results) { 
  			if(err) { throw err; }
  			console.log("Success: Tags added");
  			next();
  		}
  	);
};

exports.down = function(next){
	
	async.series([
  		function(callback) { 
			connection.query('\
				ALTER TABLE `product_has_tag` DROP FOREIGN KEY `product_has_tag_ibfk_1`;\
				ALTER TABLE `product_has_tag` DROP FOREIGN KEY `product_has_tag_ibfk_2`;\
			', callback);
		},
		function(callback) { 
			connection.query('DROP TABLE `product_has_tag`;\
					 DROP TABLE `tag`;', callback);	
		}],
  		function(err, results) { 
  			if(err) { throw err; }
  			console.log("Success: Tags removed");
  			next();
  		}
  	);
};
