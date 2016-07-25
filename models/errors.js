function ModelIntegrityError(message) {
    this.message = message;
    this.name = "ModelIntegrityError";
    Error.captureStackTrace(this, ModelIntegrityError);
}
ModelIntegrityError.prototype = Object.create(Error.prototype);
ModelIntegrityError.prototype.constructor = ModelIntegrityError;

module.exports = {
	ModelIntegrityError: ModelIntegrityError
}