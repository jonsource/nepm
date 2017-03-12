var Promise = require('bluebird');
var ModelUnknownProperty = require('./errors').ModelUnknownProperty;
var ModelIntegrityError = require('./errors').ModelIntegrityError;
var db_pool = require('../app/db_pool');

BaseModel = function(data, db_schema) {
	this.schema = db_schema || { table: null, model: BaseModel };
	if(data && data.constructor != Object) {
		this.data = Object.assign({}, data);
	} else {
		this.data = data || {};
	}
}
/**
 * recoursively gets or lazyloads properties of a model and properties of these properties etc..
 * @param {string} - propertyChain of format "property:id.subproperty:id,otherProperty:id"
 */
BaseModel.prototype.getByChain = function(propertyChain) {
	var parts = propertyChain.split(',');
	return Promise.map(parts, this._getOnePropertyByChain.bind(this));
}

BaseModel.prototype._getOnePropertyByChain = function(propertyChain) {
	var parts = propertyChain.split('.');
	var property = parts.shift();
	var model = this;
	var value = null;
	propertyChain = parts.join('.');
	parts = property.split(':');
	if(parts.length > 1) {
		property = parts[0];
		value = parts[1];
	}
	if(propertyChain) {
		return model.get(property, value)
		.then(function(prop) {
			return Promise.map(model.data[property], function(loadedProperty) {
				return loadedProperty.getByChain(propertyChain);
			});
		})
	}
	else {
		return model.get(property, value)
	}
}

/**
 * recoursively gets or lazyloads properties of a model and properties of these properties etc..
 * @param {description[]} array - array of descriptions of format "{property: name, id: value, children: description[] }, children property is optional"
 */
BaseModel.prototype.getByDescription = function(array) {
	return Promise.map(array, this._getOnePropertyByDescription.bind(this));
}

BaseModel.prototype._getOnePropertyByDescription = function(description) {
	var model = this;
	if(description.children && description.children.length) {
		return model.get(description.property, description.id)
		.then(function(prop) {
			return Promise.map(prop, function(loadedProperty) {
				return loadedProperty.getByDescription(description.children);
			});
		});
	}
	else {
		return model.get(description.property, description.id)
	}
}

/**
 * gets or lazyloads property of model
 * @param {string} property - name of porerty
 * @param {number} id - id of property to load, otherwise all properties are loaded
 */
BaseModel.prototype.get = function(property, id) {
	if(typeof this.data[property] !== 'undefined') {
		return Promise.resolve(this.data[property]);
	}
	if(this.schema.joins[property] !== 'undefined') {
		
		function assignResults(results, that, property, required) {
            var join = that.schema.joins[property];
            //console.log('assign results', results);
            if(required && !results.length) {
            	throw new ModelIntegrityError(that.schema.name+'.'+property+':'+id+' not found!');
            }
            if(join.model) {
    		    var ret = [];
    			for(var i = 0; i<results.length; i++) {
    				ret.push(new join.model(results[i]));
    			}
    			results = ret;
    		}
    		that.data[property] = results;
    		return results;
	    }

		var that = this;
		var wheres = [], from, result;
		var join = that.schema.joins[property];
		if(!join) {
			throw new ModelUnknownProperty('Unknown property '+property+' of model '+this.schema.name);
		}
		
		if(join.multi) {
			if(join.from) {
				from = join.from(this);
			} else {
				from = join.intermediate;
			}
			if(join.where) {
				wheres.push(join.where(this));
			} else {
				wheres = ['i.`'+join.source+'_id` = '+that.data.id];
			}
			if(id) {
				wheres.push('t.id = "'+id+'"');
			}
					
			return db_pool.getConnection()
	    	.then( function(connection) {
	    		var query = 'SELECT * FROM '+from+' AS i JOIN `'+join.target+'` as t '+
	    					'ON i.`'+join.target+'_id` = t.id '+
	    					'WHERE '+wheres.join(' AND ');
	    		return connection.query(query)})
	    	.then( function(results) {
	    		return assignResults(results, that, property, id!=null);
	    	});
	    }

	    if(join.source) {
	    	wheres = ['t.`id` = '+that.data[join.source+'_id']];
	    	table = join.source;
	    } else {
	    	wheres = ['t.`'+that.schema.table+'_id` = '+that.data.id];
	    	table = join.target;
	    }
	    
		if(join.where) {
			wheres.push(join.where(this));
		}
		if(id) {
			wheres.push('t.id = "'+id+'"');
		}
				
		return db_pool.getConnection()
    	.then( function(connection) {
    		var query = 'SELECT * FROM `'+table+'` AS t ' +
    					'WHERE '+wheres.join(' AND ');
    		return connection.query(query)})
    	.then( function(results) {
    		return assignResults(results, that, property, id!=null);
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
				return that.find_by('id', result.insertId);
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
        		delete data[i]['password'];
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

BaseModel.prototype.findOneBy = function(column, value, onlyValid) {
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
        	if(data.length>1) {
        		throw Error("More than one result!");
        	}
        	return new schema.model(data[0]);
    	});
}

module.exports = BaseModel;
