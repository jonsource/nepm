var BaseModel = require('./base_model');
var Join = require('./join');
var inherits = require('util').inherits;
var Option = require('./option');

function Variant(data) {
	Variant.super_.call(this, data, 
		{	table: "variant", 
			model: Variant,
			name: "variant",
			plural: "variants",
			joins: {
				options: new Join({target: 'option', multi: false, where: function(variant) {return 'variant_id = '+variant.data.id;}, model: Option }),
			}
		});
}

inherits(Variant, BaseModel);

module.exports = Variant