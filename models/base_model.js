var Promise = require('bluebird');
var IntegrityError = require('./errors').IntegrityError;
var db_pool = require('../app/db_pool');

BaseModel = function(data, db_schema) {
	this.schema = db_schema || { table: null, model: BaseModel };
	if(data && data.constructor != Object) {
		this.data = Object.assign({}, data);
	} else {
		this.data = data || {};
	}
}

BaseModel.prototype.get = function(property) {
	if(typeof this.data[property] !== 'undefined') {
		return Promise.resolve(this.data[property]);
	}
	if(this.schema.joins[property] !== 'undefined') {
		var that = this;
		var join = that.schema.joins[property];
				
		return db_pool.getConnection()
    	.then( function(connection) {
    		var query = 'SELECT * FROM `'+join.intermediate+'` AS i JOIN `'+join.target+'` as t '+
    					'ON i.`'+join.target+'_id` = t.id '+
    					'WHERE i.`'+join.source+'_id` = '+that.data.id;
    		return connection.query(query)})
    	.then( function (results) {
        	if(join.multi) {
    		    if(join.model) {
        		    var ret = [];
        			for(var i = 0; i<results.length; i++) {
        				ret.push(new join.model(results[i]));
        			}
        			results = ret;
        		}
        		return Promise.resolve(results);
	       	} else {
        		if(results.length!=1) {
        			throw IntegrityError('Expecting one item, more found!');
        		}
        		if(join.model) {
        			results = new join.model(results[0]);
        		}
        		return Promise.resolve(results);
        	}
    	});
	}
}

BaseModel.prototype.sanitize_string = function(value) {
	if(typeof(value) === "string") {
    	value = '"'+value.replace(/"/g, '\\"')+'"';
   	}
   	return value;
}

BaseModel.prototype.prepare_values_insert = function(data) {
	var cols = [];
	var vals = [];
	if(!data) {
		data = this.data;
	}
	for (var key in data) {
  		if(key == 'id') {
  			continue;
  		}
  		if (data.hasOwnProperty(key)) {
    		cols.push('`'+key+'`');
    		vals.push(this.sanitize_string(data[key]));
  		}
	}
	return '('+cols.join(', ')+') VALUES ('+vals.join(', ')+')';
}

BaseModel.prototype.prepare_values_update = function(data) {
	var set = [];
	if(!data) {
		data = this.data;
	}
	for (var key in data) {
  		if(key == 'id') {
  			continue;
  		}
  		if (data.hasOwnProperty(key)) {
    		set.push('`'+key+'` = '+this.sanitize_string(data[key]));
    	}
	}
	return set.join(', ');
}

BaseModel.prototype.save = function() {
	var query="";
	console.log('saving', this);
	if(this.data.id) {
		query = 'UPDATE `'+this.schema.table+'` SET '+this.prepare_values_update()+' WHERE id = '+this.data.id+' LIMIT 1';
	} else {
		query = 'INSERT INTO `'+this.schema.table+'` '+this.prepare_values_insert();
	}
	console.log(query);
	var that = this;
	return db_pool.getConnection()
	.then( function(connection) {
		return connection.query(query)
		.then( function(result) {
			console.log(result);
			if(result.insertId) {
				return that.findBy('id', result.insertId);
			} 
		});
	})
}

BaseModel.prototype.delete = function() {
	this.data.deleted = true;
	return this.save().then(function() {return new Promise.resolve(true)});
}

BaseModel.prototype.create = function(data) {
	ret = new this.schema.model(data);
	ret.schema = this.schema;
	return ret.save();
}

BaseModel.prototype.update = function(data) {
	Object.assign(this.data, data);
	return this.save();
}

BaseModel.prototype.find = function() {
	var schema = this.schema;
	return db_pool.getConnection()
    	.then( function(connection) {
    		return connection.query('SELECT * FROM `'+schema.table+'` WHERE 1')}) 
    	.then( function (data) {
        	var ret = [];
        	for(var i=0; i<data.length; i++) {
        		ret.push(new schema.model(data[i]));
        	}
        	return ret;
    	});
}

BaseModel.prototype.findBy = function(column, value, onlyValid) {
	if(onlyValid === null) {
		onlyValid=true;
	}
	if(typeof(value) === "string") {
		value = '"'+value+'"'
	}
	var schema = this.schema;
	return db_pool.getConnection()
    	.then( function(connection) {
    		return connection.query('SELECT * FROM `'+schema.table+'` WHERE `'+column+'` = '+value)})
    	.then( function (data) {
        	var ret = [];
        	for(var i=0; i<data.length; i++) {
        		ret.push(new schema.model(data[i]));
        	}
        	return ret;
    	});
}

module.exports = BaseModel;
