var BaseModel = require('./base_model');
var Join = require('./join');
var inherits = require('util').inherits;
var OrderItem = require('./order_item');
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

Order.prototype.create = function(data) {
	
	/*ret = new this.schema.model(data);
	ret.schema = this.schema;
	return ret.save();*/
	return data;
}

module.exports = Order
