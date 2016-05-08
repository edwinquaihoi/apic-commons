/**
 * This module represents a "method" in an APC API Operation.
 * @param apiOperation a reference to the ApiOperation object that owns the method definition.
 * @param name the method name i.e. GET, POST, PUT, DELETE etc
 * @param config an object which contains configuration values for attributes of a ApiMethod. 
 */
function ApiMethod(apiOperation, name, config) {
	
	this.apiOperation = apiOperation;
	this.name = name;
	this.targetUrl = config.targetUrl;

}

/**
 * Integrate into the require.js module system.
 */
exports.newApiMethod = function(apiOperation, name, config) {
	return new ApiMethod(apiOperation, name, config);
}