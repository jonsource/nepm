var promise = require('bluebird');

var db_pool;

BaseModel = function(data) {
	this.data = data;
}

BaseModel.prototype.data = {};

BaseModelCollection = function(table) {
	this.table = table;
}

BaseModelCollection.prototype.getValid = function() {
	return db_pool.getConnection()
    	.then( function(connection) {
    		return connection.query('SELECT * FROM `'+table+'` WHERE `'+column+'` = '+value)})
    	.then( function (data) {
        	return new BaseModel(data);
    	});
}

BaseModelCollection.prototype.findBy = function(column, value) {
	if(typeof(value) === "string") {
		value = '"'+value+'"'
	}
	var table = this.table;
    return db_pool.getConnection()
    	.then( function(connection) {
    		return connection.query('SELECT * FROM `'+table+'` WHERE `'+column+'` = '+value)})
    	.then( function (data) {
        	return new BaseModel(data);
    	});
}

module.exports = function(pool)
{	db_pool = pool;
	return {
		Collection: BaseModelCollection,
		Model: BaseModel
	}
}
