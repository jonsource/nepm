var promise = require('bluebird');

BaseModel = function(data) {
	this.data = data;
}

BaseModel.prototype.data = {};

BaseModelCollection = function(db_pool, table) {
	this.db_pool = db_pool;
	this.table = table;
}

BaseModelCollection.prototype.findBy = function (column, value) {
	if(typeof(value) === "string") {
		value = '"'+value+'"'
	}
	var table = this.table;
    return this.db_pool.getConnection()
    	.then( function(connection) {
    		return connection.query('SELECT * FROM `'+table+'` WHERE `'+column+'` = '+value)})
    	.then( function (data) {
        	return new BaseModel(data);
    	});
}

module.exports = function(db_pool, table) {
	return new BaseModelCollection(db_pool, "product")
}
