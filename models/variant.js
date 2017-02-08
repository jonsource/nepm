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
				options: new Join({source: 'product', target: 'option', multi: true,
					where: function(variant) {
						if(variant.data['product_id']) {
							return 'variant_id = '+variant.data.id+' AND product_id = '+variant.data.product_id;
						}
						return 'variant_id = '+variant.data.id;
					},
					/*from: function(variant) {
						if(variant.data['product_id']) {
							return 'fFROMf';
						}
						return 'option';
					},*/
					model: Option }),
			}
		});
}

inherits(Variant, BaseModel);

module.exports = Variant