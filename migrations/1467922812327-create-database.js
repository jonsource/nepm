var mysql = require('mysql');
var dbconfig = require('../config/database');
dbconfig.connection.multipleStatements = true;
var db = dbconfig.connection.database
delete dbconfig.connection.database
var connection = mysql.createConnection(dbconfig.connection);
dbconfig.connection.database = db
var async = require('async');

exports.up = function(next){
  	
	async.series([
		function(callback) {
			connection.query('CREATE DATABASE ' + dbconfig.connection.database + ' CHARACTER SET utf8 COLLATE utf8_general_ci;', callback);	
		},
		function(callback) {
			connection.query('USE ' + dbconfig.connection.database +';', function(err, result) {
				console.log('Success: Database Created!');	
				callback(null, 'Success: Database Created!');
			});
		},
		function(callback) {
			connection.query('\
			CREATE TABLE `' + dbconfig.users_table + '` ( \
			    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
			    `username` VARCHAR(20) NOT NULL, \
			    `password` CHAR(60) NOT NULL, \
			        PRIMARY KEY (`id`), \
			    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
			    UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
			)', callback);
		},
		function(callback) {
			connection.query('\
				CREATE TABLE `customer` ( \
					`id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL, \
					`name` VARCHAR(64) NOT NULL, \
					`email` VARCHAR(64) NOT NULL, \
					PRIMARY KEY (`id`) \
			)', callback);
		},
		function(callback) {	
			connection.query('\
				CREATE TABLE `order` ( \
					`id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL, \
					`customer_id` INTEGER NULL DEFAULT NULL, \
					PRIMARY KEY (`id`) \
				)', callback);
		},
		function(callback) {
			connection.query(' \
			CREATE TABLE `order_item` (\
				`id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL, \
				`order_id` INTEGER NOT NULL, \
				`product_id` INTEGER NULL DEFAULT NULL, \
				`order_item_option_id` INTEGER NULL DEFAULT NULL, \
				`quantity` INTEGER NOT NULL, \
				PRIMARY KEY (`id`) \
			)', callback);
		},
		function(callback) {
			connection.query(' \
			CREATE TABLE `product` ( \
				`id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL, \
				`parent_id` INTEGER NULL DEFAULT NULL, \
				`price` DECIMAL(6.2) NULL DEFAULT NULL, \
				`name` VARCHAR(64) NULL DEFAULT NULL, \
				`descirption` MEDIUMTEXT NULL DEFAULT NULL, \
				PRIMARY KEY (`id`) \
			)', callback);
		},
		function(callback) {
			connection.query(' \
			CREATE TABLE `variant` ( \
				`id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL, \
				`name` VARCHAR(32) NOT NULL, \
				PRIMARY KEY (`id`) \
			)', callback);
		},
		function(callback) {
			connection.query(' \
			CREATE TABLE `option` ( \
		  		`id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL, \
				`variant_id` INTEGER NULL DEFAULT NULL, \
				`name` VARCHAR(32) NOT NULL, \
				PRIMARY KEY (`id`) \
			)', callback);
		},
		function(callback) {
			connection.query(' \
			CREATE TABLE `product_has_variant` ( \
				`product_id` INTEGER NULL DEFAULT NULL, \
				`variant_id` INTEGER NULL DEFAULT NULL, \
				PRIMARY KEY (`product_id`, `variant_id`) \
			)', callback);
		},
		function(callback) {
			connection.query(' \
			CREATE TABLE `product_has_option` ( \
				`id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL, \
				`product_id` INTEGER NULL DEFAULT NULL, \
				`option_id` INTEGER NULL DEFAULT NULL, \
				`price` DECIMAL(6.2) NULL DEFAULT NULL, \
				PRIMARY KEY (`id`) \
			)', callback);
		},
		function(callback) {
			connection.query(' \
			CREATE TABLE `order_item_option` ( \
				`id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL, \
				`variant_name` VARCHAR(32) NOT NULL, \
				`option_name` VARCHAR(32) NOT NULL, \
				`price` DECIMAL(6.2) NULL DEFAULT NULL, \
				PRIMARY KEY (`id`) \
			)', callback);
		},
		function(callback) {
			connection.query(' \
			ALTER TABLE `order` ADD FOREIGN KEY (customer_id) REFERENCES `customer` (`id`);', callback);
		},
		function(callback) {
			connection.query(' \
			ALTER TABLE `order_item` ADD FOREIGN KEY (order_id) REFERENCES `order` (`id`);', callback);
		},
		function(callback) {
			connection.query(' \
				ALTER TABLE `order_item` ADD FOREIGN KEY (product_id) REFERENCES `product` (`id`);\
				ALTER TABLE `order_item` ADD FOREIGN KEY (order_item_option_id) REFERENCES `order_item_option` (`id`);\
				ALTER TABLE `product` ADD FOREIGN KEY (parent_id) REFERENCES `product` (`id`);\
				ALTER TABLE `option` ADD FOREIGN KEY (variant_id) REFERENCES `variant` (`id`);\
				ALTER TABLE `product_has_variant` ADD FOREIGN KEY (product_id) REFERENCES `product` (`id`);\
				ALTER TABLE `product_has_variant` ADD FOREIGN KEY (variant_id) REFERENCES `variant` (`id`);\
				ALTER TABLE `product_has_option` ADD FOREIGN KEY (product_id) REFERENCES `product` (`id`);\
				ALTER TABLE `product_has_option` ADD FOREIGN KEY (option_id) REFERENCES `option` (`id`);',
				function(err, results) {
					callback(null, "foreign keys added");
			});
		}],
		function(err, results) {
			if(err) { throw err; }
			console.log(results);
			console.log('Success: Tables and keys updated!')
	  		next();
		}	  		
	);
};

exports.down = function(next){
  	connection.query('DROP DATABASE ' + dbconfig.connection.database, function(err, result) {
  		if(err) { throw err; }
  			console.log(result);
  			console.log('Success: Database Dropped!');
  			next();
  	});
};