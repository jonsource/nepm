var promise = require('bluebird');

var db_pool;
var db_model;

function getValid() {
	return db_pool.getConnection()
    	.then( function(connection) {
    		return connection.query('SELECT * FROM `'+db_model.table+'` WHERE 1')}) 
    	.then( function (data) {
        	var ret = [];
        	for(var i=0; i<data.length; i++) {
        		ret.push(new db_model.constructor(data[i]));
        	}
        	return ret;
    	});
}

function findBy(column, value, onlyValid) {
	if(onlyValid === null) {
		onlyValid=true;
	}
	if(typeof(value) === "string") {
		value = '"'+value+'"'
	}
	return db_pool.getConnection()
    	.then( function(connection) {
    		return connection.query('SELECT * FROM `'+db_model.table+'` WHERE `'+column+'` = '+value)})
    	.then( function (data) {
        	return new db_model.const(data);
    	});
}

function save(object) {
	console.log('saving', object);
	if(object.data.id) {
		query = 'UPDATE INTO `'+db_model.table+'` SET '+values+' WHERE id = '+object.data.id+' LIMIT 1';
	} else {
		query = 'INSERT INTO `'+db_model.table+'` VALUES '+values+' WHERE id = '+object.data.id+' LIMIT 1';
	}
	return db_pool.getConnection()
    	.then( function(connection) {
    		return connection.query(query)
    	})
    	.then( function(result) {
    		if(object.data.id) {
    			object.data.id = result.insertId;
    		}
    		return object;
    	})
}

function create(data) {
	var o = new db_model(data);
	o.collection = this;
	return o.save();
}

function delete(object) {
	object.data.deleted = true;
	return o.save().then(function() {return true;});
}

module.exports = function(pool, model)
{	db_pool = pool;
	db_model = model
	console.log('db_model', db_model, db_model.table)
	return {
		model: db_model,
		create: create,
		get: getValid,
		findBy: findBy,
		save: save
	}
}
