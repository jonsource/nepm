var BaseModel = require('./base_model');
var Join = require('./join');
var inherits = require('util').inherits;
var Order = require('./order');

function Customer (data) {
	Customer.super_.call(this, data, 
		{	table: "customer", 
			model: Customer,
			name: "customer",
			plural: "customers",
			joins: {
				orders: new Join({target: 'order', multi: false, model: Order})
			}
		});
}

inherits(Customer, BaseModel);

module.exports = Customer
