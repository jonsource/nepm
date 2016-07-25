var BaseModel = require('./base_model');
var Join = require('./join');
var inherits = require('util').inherits;
var Variant = require('./variant');

function Product (data) {
	Product.super_.call(this, data, 
		{	table: "product", 
			model: Product,
			name:"product",
			plural: "products",
			joins: {
				tags: new Join({source: "product", target: 'tag', multi: true}),
				options: new Join({source: "product", target: 'option', multi: true}),
				variants: new Join({source: "product", target: 'variant', multi: true, model: Variant})
			}
		});
}

inherits(Product, BaseModel);

Product.prototype.argh = function() {
	console.log('argh');
}

module.exports = Product
