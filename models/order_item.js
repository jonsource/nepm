var Promise = require('bluebird');
var BaseModel = require('./base_model');
var Join = require('./join');
var inherits = require('util').inherits;
var Order = require('./order');
var Product = require('./product');
var product = new Product();
var log = require('debug')('nepm:models:order_item')

var orderItemPropertiesMap = {
	product_id: 'id',
	name: 'name',
	description: 'description',
}

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

OrderItem.prototype.create = function(description) {

	function getProductInstance(description) {
		return product.findOneBy('id', description.product_id)
		.then(function(instance) {
			return instance.getByDescription(description.description)
			.then(function() {
				return instance;
			});
		});
	}
	
	var ret = new this.schema.model();
	ret.schema = this.schema;
	
	return getProductInstance(description)
	.then(function(productInstance) {
		log('data for item:', productInstance);
		for(item in orderItemPropertiesMap) {
			ret.data[item] = productInstance.data[orderItemPropertiesMap[item]];
		}
		ret.data.order_id = description.order_id;
		return ret.save();
	});
}

module.exports = OrderItem
