var BaseModel = require('./base_model');
var Join = require('./join');
var inherits = require('util').inherits;
var Variant = require('./variant');
var Option = require('./option');

function Product (data) {
	Product.super_.call(this, data, 
		{	table: "product", 
			model: Product,
			name:"product",
			plural: "products",
			joins: {
				tags: new Join({source: "product", target: 'tag', multi: true}),
				options: new Join({source: "product", target: 'option', multi: true, model: Option}),
				variants: new Join({source: "product", target: 'variant', multi: true, model: Variant})
			}
		});
}

inherits(Product, BaseModel);

module.exports = Product
