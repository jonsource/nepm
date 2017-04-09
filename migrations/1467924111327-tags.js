dbconfig = require('../config/database')
connection = require('./connection')
query = connection.query;

exports.up = function(next){
  	
  	connection.getConnect()
  		.then(query('\
				CREATE TABLE `tag` (\
					`id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,\
					`name` VARCHAR(64) NOT NULL,\
					`parent_tag_id` INTEGER NULL DEFAULT NULL,\
					`deleted` BOOLEAN NOT NULL DEFAULT 0, \
					PRIMARY KEY (`id`)\
			)'))
		.then(query('\
				CREATE TABLE `product_has_tag` (\
						`product_id` INTEGER NULL DEFAULT NULL,\
						`tag_id` INTEGER NULL DEFAULT NULL,\
						`deleted` BOOLEAN NOT NULL DEFAULT 0, \
						PRIMARY KEY (`product_id`, `tag_id`)\
			)'))
		.then(query('\
				ALTER TABLE `product_has_tag` ADD FOREIGN KEY (product_id) REFERENCES `product` (`id`);\
				ALTER TABLE `product_has_tag` ADD FOREIGN KEY (tag_id) REFERENCES `tag` (`id`);\
			'))
		.then(function() {next();})
		.catch(function (err) {
			throw(err)
		})
};

exports.down = function(next){
	
	connection.getConnect()
  		.then(query('\
				ALTER TABLE `product_has_tag` DROP FOREIGN KEY `product_has_tag_ibfk_1`;\
				ALTER TABLE `product_has_tag` DROP FOREIGN KEY `product_has_tag_ibfk_2`;\
			'))
		.then(query('DROP TABLE `product_has_tag`;\
					 DROP TABLE `tag`;'
			))
		.then(next);
};
