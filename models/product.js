var BaseModel = require('./base_model');
var inherits = require('util').inherits

function Product (data) {
	Product.super_.call(this, data);
}

inherits(Product, BaseModel);

Product.prototype.table = "product";
Product.prototype.const = Product;

Product.prototype.argh = function() {
	console.log('argh');
}

module.exports = Product
