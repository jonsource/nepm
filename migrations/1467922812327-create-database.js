dbconfig = require('../config/database')
connection = require('./connection')
query = connection.query;

exports.up = function(next){
  	
	connection.getConnect()
		.then(function() {console.log('after get connect')})
		//.then(query('CREATE DATABASE ' + dbconfig.connection.database + ' CHARACTER SET utf8 COLLATE utf8_general_ci;'))
		.then(query('CREATE DATABASE test CHARACTER SET utf8 COLLATE utf8_general_ci;'))
		//.then(query('USE ' + dbconfig.connection.database +';'))
		.then(query('USE test;'))
		.then(console.log('Success: Database Created!'))
		.then(query('\
		CREATE TABLE `' + dbconfig.users_table + '` ( \
		    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
		    `username` VARCHAR(20) NOT NULL, \
		    `password` CHAR(60) NOT NULL, \
		    `deleted` BOOLEAN NOT NULL DEFAULT 0, \
		    PRIMARY KEY (`id`), \
		    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
		    UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
		)'))
		.then(query('\
				CREATE TABLE `customer` ( \
					`id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL, \
					`name` VARCHAR(64) NOT NULL, \
					`email` VARCHAR(64) NOT NULL, \
					`deleted` BOOLEAN NOT NULL DEFAULT 0, \
					PRIMARY KEY (`id`) \
			)'))
		.then(query('\
				CREATE TABLE `order` ( \
					`id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL, \
					`customer_id` INTEGER NULL DEFAULT NULL, \
					`deleted` BOOLEAN NOT NULL DEFAULT 0, \
					PRIMARY KEY (`id`) \
				)'))
		.then(query(' \
			CREATE TABLE `order_item` (\
				`id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL, \
				`order_id` INTEGER NOT NULL, \
				`product_id` INTEGER NULL DEFAULT NULL, \
				`quantity` INTEGER NOT NULL, \
				`unit_price` DECIMAL(6.2) NOT NULL, \
				`name` VARCHAR(32) NOT NULL, \
				`description` MEDIUMTEXT NULL DEFAULT NULL, \
				`deleted` BOOLEAN NOT NULL DEFAULT 0, \
				PRIMARY KEY (`id`) \
			)'))
		.then(query(' \
			CREATE TABLE `product` ( \
				`id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL, \
				`parent_id` INTEGER NULL DEFAULT NULL, \
				`price` DECIMAL(6.2) NULL DEFAULT NULL, \
				`name` VARCHAR(64) NULL DEFAULT NULL, \
				`description` MEDIUMTEXT NULL DEFAULT NULL, \
				`deleted` BOOLEAN NOT NULL DEFAULT 0, \
				PRIMARY KEY (`id`) \
			)'))
		.then(query(' \
			CREATE TABLE `variant` ( \
				`id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL, \
				`name` VARCHAR(32) NOT NULL, \
				`deleted` BOOLEAN NOT NULL DEFAULT 0, \
				PRIMARY KEY (`id`) \
			)'))
		.then(query(' \
			CREATE TABLE `option` ( \
		  		`id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL, \
				`variant_id` INTEGER NULL DEFAULT NULL, \
				`name` VARCHAR(32) NOT NULL, \
				`deleted` BOOLEAN NOT NULL DEFAULT 0, \
				PRIMARY KEY (`id`) \
			)'))
		.then(query(' \
			CREATE TABLE `product_has_variant` ( \
				`product_id` INTEGER NULL DEFAULT NULL, \
				`variant_id` INTEGER NULL DEFAULT NULL, \
				`deleted` BOOLEAN NOT NULL DEFAULT 0, \
				PRIMARY KEY (`product_id`, `variant_id`) \
			)'))
		.then(query(' \
			CREATE TABLE `product_has_option` ( \
				`id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL, \
				`product_id` INTEGER NULL DEFAULT NULL, \
				`option_id` INTEGER NULL DEFAULT NULL, \
				`price` DECIMAL(6.2) NULL DEFAULT NULL, \
				`deleted` BOOLEAN NOT NULL DEFAULT 0, \
				PRIMARY KEY (`id`) \
			)'))
		.then(query(' \
			CREATE TABLE `order_item_option` ( \
				`id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL, \
				`order_item_id` INTEGER NOT NULL, \
				`variant_name` VARCHAR(32) NOT NULL, \
				`option_name` VARCHAR(32) NOT NULL, \
				`price` DECIMAL(6.2) NULL DEFAULT NULL, \
				`deleted` BOOLEAN NOT NULL DEFAULT 0, \
				PRIMARY KEY (`id`) \
			)'))
		.then(query(' \
			ALTER TABLE `order` ADD FOREIGN KEY (customer_id) REFERENCES `customer` (`id`);'))
		.then(query(' \
			ALTER TABLE `order_item` ADD FOREIGN KEY (order_id) REFERENCES `order` (`id`);'))
		.then(query('ALTER TABLE `order_item` ADD FOREIGN KEY (product_id) REFERENCES `product` (`id`);'))
		.then(query('ALTER TABLE `order_item_option` ADD FOREIGN KEY (order_item_id) REFERENCES `order_item` (`id`);'))
		.then(query('ALTER TABLE `product` ADD FOREIGN KEY (parent_id) REFERENCES `product` (`id`);'))
		.then(query('ALTER TABLE `option` ADD FOREIGN KEY (variant_id) REFERENCES `variant` (`id`);'))
		.then(query('ALTER TABLE `product_has_variant` ADD FOREIGN KEY (product_id) REFERENCES `product` (`id`);'))
		.then(query('ALTER TABLE `product_has_variant` ADD FOREIGN KEY (variant_id) REFERENCES `variant` (`id`);'))
		.then(query('ALTER TABLE `product_has_option` ADD FOREIGN KEY (product_id) REFERENCES `product` (`id`);'))
		.then(query('ALTER TABLE `product_has_option` ADD FOREIGN KEY (option_id) REFERENCES `option` (`id`);'))
		.then(function() {next();})
};

exports.down = function(next){
  	connection.query('DROP DATABASE ' + dbconfig.connection.database, function(err, result) {
  		if(err) { throw err; }
  			console.log(result);
  			console.log('Success: Database Dropped!');
  			next();
  	});
};