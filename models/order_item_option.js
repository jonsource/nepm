var Promise = require('bluebird');
var BaseModel = require('./base_model');
var Join = require('./join');
var inherits = require('util').inherits;
var OrderItem = require('./order_item');
var log = require('debug')('nepm:models:order_item_option')

function OrderItemOption (data) {
	OrderItemOption.super_.call(this, data, 
		{	table: "order_item_option",
			model: OrderItemOption,
			name: "order_item_option",
			plural: "order_item_options",
		});
}

inherits(OrderItemOption, BaseModel);

module.exports = OrderItemOption