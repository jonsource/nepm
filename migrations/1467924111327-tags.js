var mysql = require('mysql');
var dbconfig = require('../config/database');
dbconfig.connection.multipleStatements = true;
var connection = mysql.createConnection(dbconfig.connection);

exports.up = function(next){
  	connection.query('USE ' + dbconfig.database +';');
		
	connection.query('\
	CREATE TABLE `tag` (\
			`id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,\
			`name` VARCHAR(64) NOT NULL,\
			`parent_tag_id` INTEGER NULL DEFAULT NULL,\
			PRIMARY KEY (`id`)\
	)');

	connection.query('\
	CREATE TABLE `product_has_tag` (\
			`product_id` INTEGER NULL DEFAULT NULL,\
			`tag_id` INTEGER NULL DEFAULT NULL,\
			PRIMARY KEY (`product_id`, `tag_id`)\
	)');

	connection.query('\
	ALTER TABLE `product_has_tag` ADD FOREIGN KEY (product_id) REFERENCES `product` (`id`);\
	ALTER TABLE `product_has_tag` ADD FOREIGN KEY (tag_id) REFERENCES `tag` (`id`);\
	');
  	next();
};

exports.down = function(next){
	connection.query('USE ' + dbconfig.database +';');

	connection.query('\
	ALTER TABLE `product_has_tag` DROP FOREIGN KEY `product_has_tag_ibfk_1`;\
	ALTER TABLE `product_has_tag` DROP FOREIGN KEY `product_has_tag_ibfk_2`;\
	');

	connection.query('DROP TABLE `product_has_tag`;');
	connection.query('DROP TABLE `tag`;');	
  	next();
};