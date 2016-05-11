/**
 * This module represents a APIC API definition.
 * @param frameworkLocation the location from which to load other framework modules.
 * @param name the name of the API
 * @param version the version of the API
 * @param operationMap a multi dimensional array containing operations that belong to the API.
 * @param logger a Logger object which is used by framework code to log.
 */	
function Api(frameworkLocation, name, version, operationMap, logger) {
	
	this.name = name;
	this.version = version;
	this.operationMap = [];
	this.logger = logger;
	
	var apiOperationCreator = require(frameworkLocation + "ApiOperation.js"); 

	// loop through operationMap and make and index map
	for (var i = 0; i < operationMap.length; i++) {
		var op = apiOperationCreator.newApiOperation(frameworkLocation,this, operationMap[i].name, operationMap[i].methods);
		this.operationMap[operationMap[i].name] = op;
	}
}	

/**
 * Gets an ApiOperation by name.
 * @param name the name of the ApiOperation.
 * @returns an ApiOperation
 */
Api.prototype.getOperation = function(name) {
	return this.operationMap[name];
}

/**
 * Gets the underlying array which contains the ApiOperations.
 * @param name the name of the ApiOperation
 */
Api.prototype.getOperationMap = function() {
	return this.operationMap;
}

Api.prototype.logHeaders = function(apim) {
	
	// get the message headers
	try {
		var headerz = apim.getvariable('message.headers');
		var headerLogPayload = {headers:headerz};
		this.logger.notice(JSON.stringify(headerLogPayload));
	} catch(e) {
		this.logger.error(e);
		throw e;
	}
}

Api.prototype.logBody = function(apim) {
	
	// get the message headers
	try {
		var bodi = apim.getvariable('message.body');
		var bodyPayload = {body:bodi};
		this.logger.debug(JSON.stringify(bodyPayload));
	} catch(e) {
		this.logger.error(e);
		throw e;
	}
}

Api.prototype.logPayload = function(apim) {
	return this.operationMap;
}

/**
 * Integrates into require.js module system.
 */
exports.newApi= function(frameworkLocation,name, version, operationMap, logger) {
	return new Api(frameworkLocation,name, version, operationMap, logger);
}