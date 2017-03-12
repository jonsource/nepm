var Promise = require('bluebird');
var BaseModel = require('./base_model');
var Join = require('./join');
var inherits = require('util').inherits;
var Order = require('./order');
var Product = require('./product');
var product = new Product();

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

	function getProductInstance(data) {
		return product.findOneBy('id', data.product_id)
		.then(function(instance) {
			return instance.getByDescription(data.description)
			.then(function() {
				return instance;
			});
		});
	}
	
	var ret = new this.schema.model();
	ret.schema = this.schema;
	
	return getProductInstance(data)
	.then(function(prod) {
		console.log('data for item:', prod);
		return ret;
	});
}

module.exports = OrderItem
