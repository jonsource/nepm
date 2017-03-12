var Promise = require('bluebird');
var BaseModel = require('./base_model');
var Join = require('./join');
var inherits = require('util').inherits;
var OrderItem = require('./order_item');
var orderItem = new OrderItem();
var Customer = require('./customer');

function Order (data) {
	Order.super_.call(this, data, 
		{	table: "order", 
			model: Order,
			name: "order",
			plural: "orders",
			joins: {
				items: new Join({target: "order_item", multi: false, model: OrderItem}),
				customer: new Join({source: "customer", multi: false, model: Customer})
			}
		});
}

inherits(Order, BaseModel);

Order.prototype.create = function(orderData) {
	
	var ret = new this.schema.model();
	ret.schema = this.schema;

	return Promise.map(orderData, orderItem.create.bind(orderItem))
	.then(function(items) {
		console.log('items:', items);
		return ret;
	});
}

module.exports = Order
