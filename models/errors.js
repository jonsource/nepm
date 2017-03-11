var util = require('util')

function ModelIntegrityError(message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    
    
}
util.inherits(ModelIntegrityError, Error);

function ModelUnknownProperty(message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    
    
}
util.inherits(ModelUnknownProperty, Error);

module.exports = {
	ModelIntegrityError: ModelIntegrityError,
	ModelUnknownProperty: ModelUnknownProperty
}
