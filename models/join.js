Join = function(opts) {
	this.source = opts.source;
	if(!this.source) {
		throw new Error('Source of join not defined');
	}
	this.model = opts.model;
	this.target = opts.target || this.model.schema.table;
	if(!this.target) {
		throw new Error('Target of join not defined');
	}
	this.multi = opts.multi;
	this.intermediate = opts.intermediate || this.source+'_has_'+this.target;
	this.where = opts.where;
}

module.exports = Join;
