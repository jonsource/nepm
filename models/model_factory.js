var BaseModel = require('./base_model');
var inherits = require('util').inherits;

createModel = function(db_schema) {
	var ret = function CreatedModel(data) {
		this.schema = db_schema || { table: null, model: BaseModel };
		if(data && data.constructor != Object) {
			this.data = Object.assign({}, data);
		} else {
			this.data = data || {};
		}
		this.schema.model = CreatedModel;
	}
	inherits(ret, BaseModel);
	return ret;
}

module.exports = {
	createModel: createModel
}
