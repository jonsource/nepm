BaseModel = function(data) {
	this.data = data || {};
}

BaseModel.prototype.table = null;
BaseModel.prototype.const = BaseModel;
BaseModel.prototype.save = function() {
	return this.collection.save(this);
}
BaseModel.prototype.delete = function() {
	return this.collection.delete(this);
}
BaseModel.prototype.update = function(data) {
	this.data = data || {};
	return this.collection.save(this);	
}

module.exports = BaseModel
