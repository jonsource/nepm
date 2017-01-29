Join = function(opts) {
	this.multi = opts.multi || false;
	this.model = opts.model;
	if(this.multi) {
		this.source = opts.source;
		if(!this.source) {
			throw new Error('Source of join not defined');
		}
		
		this.target = opts.target;
		if(!this.target) {
			throw new Error('Target of join not defined');
		}
		this.intermediate = opts.intermediate || this.source+'_has_'+this.target;
	}
	else {
		if((!opts.target && !opts.source) || (opts.target && opts.source)) {
			throw new Error('Target or source (not both) of 1:N join must be defined');
		}
		console.log(this.model);	
		this.target = opts.target;
		this.source = opts.source;
	}
	
	this.where = opts.where;
	this.api_accessible = opts.api_accessible;
}

module.exports = Join;
