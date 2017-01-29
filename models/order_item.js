var BaseModel = require('./base_model');
var Join = require('./join');
var inherits = require('util').inherits;
var Order = require('./order');

function OrderItem (data) {
	OrderItem.super_.call(this, data, 
		{	table: "order_item",
			model: OrderItem,
			name: "order_item",
			plural: "order_items",
			joins: {
				order: new Join({source: "order", multi: false, model: OrderItem})
			}
		});
}

inherits(OrderItem, BaseModel);

OrderItem.prototype.create = function(data) {
	
	/*ret = new this.schema.model(data);
	ret.schema = this.schema;
	return ret.save();*/
	return data;
}

module.exports = OrderItem
