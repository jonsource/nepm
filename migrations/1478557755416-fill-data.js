dbconfig = require('../config/database')
connection = require('./connection')
query = connection.query;

exports.up = function(next){
  	
  	connection.getConnect()
  		.then(query(' \
				INSERT INTO `product` (`id`,`price`, `name`, `descirption`) VALUES\
					(1, 10.0, "t-shirt", "Obyčejné triko"),\
					(2, 25.0, "trousers", "Obyčejné kalhoty"),\
					(3, 15.0, "shirt", "Obyčejná košile");\
			'))
		.then(query(' \
				INSERT INTO `variant` (`id`, `name`) VALUES\
					(1, "velikost"),\
					(2, "barva");\
			'))
		.then(query('\
				INSERT INTO `option` (`id`, `variant_id`, `name`) VALUES\
					(1, 1, "s"),\
					(2, 1, "m"),\
					(3, 1, "l"),\
					(4, 1, "xl"),\
					(5, 2, "červená"),\
					(6, 2, "modrá"),\
					(7, 2, "bílá");\
		'))
		.then(query(' \
				INSERT INTO `product_has_variant` (`product_id`, `variant_id`) VALUES\
					(1, 1),\
					(1, 2),\
					(2, 1),\
					(2, 2),\
					(3, 1);\
			'))
		.then(query(' \
				INSERT INTO `product_has_option` (`id`, `product_id`, `option_id`, `price`) VALUES\
					(1, 1, 1, 0.0),\
					(2, 1, 2, 0.0),\
					(3, 1, 3, 0.5),\
					(4, 1, 4, 1.0),\
					(5, 1, 5, 0.0),\
					(6, 1, 6, 0.0),\
					(7, 1, 7, 0.0),\
					(8, 2, 1, 0.0),\
					(9, 2, 2, 0.0),\
					(10, 2, 3, 1.0),\
					(11, 2, 4, 2.0),\
					(12, 2, 5, 0.0),\
					(13, 2, 6, 0.0),\
					(14, 2, 7, 2.0),\
					(15, 3, 1, 0.0),\
					(16, 3, 2, 0.5),\
					(17, 3, 3, 1.0),\
					(18, 3, 4, 2.5);\
			'))
		.then(query(' \
			INSERT INTO `customer` (`id`, `name`, `email`) VALUES\
				(1, "pepik", "pepik@seznam.cz"),\
				(2, "lojzik", "lojzik@seznam.cz"),\
				(3, "amalka", "amalka@seznam.cz");\
			'))
		.then(query(' \
			INSERT INTO `order` (`id`, `customer_id`) VALUES\
				(1, 1),\
				(2, 3),\
				(3, 3);\
			'))
		.then(query(' \
			INSERT INTO `client` (`id`, `username`, `password`) VALUES\
				(1, "krtek", "$2a$10$bnJvCIWwWsVkx.ciPuCBdunYOtQ01PswDAZndDNo6w5H4/4mVlfGG");\
			'))
		.then(function() {next();})
		.catch(function (err) {
			throw(err)
		})
};

exports.down = function(next){
	
	connection.getConnect()
  		.then(query('\
				SET foreign_key_checks = 0;\
				TRUNCATE TABLE product_has_option;\
				TRUNCATE TABLE product_has_variant;\
				TRUNCATE TABLE `option`;\
				TRUNCATE TABLE `variant`;\
				TRUNCATE TABLE `product`;\
				TRUNCATE TABLE `customer`;\
				TRUNCATE TABLE `order`;\
				SET foreign_key_checks = 1;\
			'))
		.then(next);
};
