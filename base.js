Date.prototype.toMySQLString = function() {
	return this.toISOString().slice(0, 19).replace('T', ' ');
}
