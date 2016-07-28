var BaseModel = require('./base_model');
var Join = require('./join');
var inherits = require('util').inherits;

function Variant(data) {
	Variant.super_.call(this, data, 
		{	table: "variant", 
			model: Variant,
			name: "variant",
			plural: "variants",
			joins: {
				options: new Join({source: "product", target: 'option', multi: true, where: function(variant) {return 'variant_id = '+variant.data.id;} }),
			}
		});
}

inherits(Variant, BaseModel);

module.exports = Variant