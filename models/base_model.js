var promise = require('bluebird');

var db_pool;
var db_table;

BaseModel = function(data) {
	this.data = data;
}

BaseModel.prototype.data = {};

getValid = function() {
	return db_pool.getConnection()
    	.then( function(connection) {
    		return connection.query('SELECT * FROM `'+table+'` WHERE `'+column+'` = '+value)})
    	.then( function (data) {
        	return new BaseModel(data);
    	});
}

findBy = function(column, value, onlyValid) {
	if(onlyValid === null) {
		onlyValid=true;
	}
	if(typeof(value) === "string") {
		value = '"'+value+'"'
	}
	return db_pool.getConnection()
    	.then( function(connection) {
    		return connection.query('SELECT * FROM `'+db_table+'` WHERE `'+column+'` = '+value)})
    	.then( function (data) {
        	return new BaseModel(data);
    	});
}


module.exports = function(pool, table)
{	db_pool = pool;
	db_table = table;
	return {
		create: BaseModel,
		getvalid: getValid,
		findBy: findBy
	}
}
