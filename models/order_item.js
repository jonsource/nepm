var Promise = require('bluebird');
var BaseModel = require('./base_model');
var Join = require('./join');
var inherits = require('util').inherits;
var Order = require('./order');
var OrderItemOption = require('./order_item_option');
var Product = require('./product');
var product = new Product();
var log = require('debug')('nepm:models:order_item')

function OrderItem (data) {
	OrderItem.super_.call(this, data, 
		{	table: "order_item",
			model: OrderItem,
			name: "order_item",
			plural: "order_items",
			joins: {
				order: new Join({source: "order", multi: false, model: Order}),
				options: new Join({target: 'order_item_option', multi: false, model: OrderItemOption})
			}
		});
}

inherits(OrderItem, BaseModel);

OrderItem.prototype._mapFromProductInstance = function(productInstance) {
	var orderItemPropertiesMap = {
		product_id: 'id',
		name: 'name',
		description: 'description',
	};

	log('data for item: %O', productInstance);
	// maps product instance to irder item
	for(item in orderItemPropertiesMap) {
		this.data[item] = productInstance.data[orderItemPropertiesMap[item]];
		log('mapping data %s %O', item, productInstance.data[orderItemPropertiesMap[item]]);
	}

	if (productInstance.data['variants']) {
		this.data.options=[];
		for (i=0; i<productInstance.data['variants'].length; i++) {
			var variant = productInstance.data['variants'][i];
			var opt = new OrderItemOption();
			log('mapping variant %O %O', variant, opt);
			opt.data.variant_name = variant.data.name;
			opt.data.option_name = variant.data.options[0].data.name;
			opt.data.price = variant.data.options[0].data.price;
			this.data.options.push(opt);
		}
	}
	return this;
}

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
		
	return getProductInstance(description)
	.then(ret._mapFromProductInstance.bind(ret));
}

module.exports = OrderItem
