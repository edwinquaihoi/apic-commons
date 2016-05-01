function ApiMethod(apiOperation, name, config) {
	
	this.apiOperation = apiOperation;
	this.name = name;
	this.targetUrl = config.targetUrl

}

exports.newApiMethod = function(apiOperation, name, config) {
	return new ApiMethod(apiOperation, name, config);
}