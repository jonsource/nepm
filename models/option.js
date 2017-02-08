var BaseModel = require('./base_model');
var Join = require('./join');
var inherits = require('util').inherits;

function Option(data) {
	Option.super_.call(this, data, 
		{	table: "option", 
			model: Option,
			name: "option",
			plural: "options",
			joins: {
				
			}
		});
}

inherits(Option, BaseModel);

module.exports = Option