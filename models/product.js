var BaseModel = require('./base_model');
var inherits = require('util').inherits;

function Product (data) {
	Product.super_.call(this, data, {table: "product", model: Product, name:"product", plural: "products"});
}

inherits(Product, BaseModel);

Product.prototype.argh = function() {
	console.log('argh');
}

module.exports = Product
