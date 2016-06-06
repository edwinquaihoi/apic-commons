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

Api.prototype.logAuditData = function(apim) {
	
	// get the message headers
	try {
		var log = {};
		var audit = {};
		audit.orgname = apim.getvariable('api.org.name');
		audit.api = apim.getvariable('api.name');
		audit.apiversion = apim.getvariable('api.version');
		audit.requesturi = apim.getvariable('request.uri');
		audit.clientappname = apim.getvariable('client.app.name');
		audit.clientid = apim.getvariable('client.app.id');
		audit.datetime = apim.getvariable('system.datetime');
		log.audit = audit;
		log.headers = apim.getvariable('message.headers').headers;
		this.logger.notice(JSON.stringify(log));
	} catch(e) {
		this.logger.error(e);
		throw e;
	}
}

Api.prototype.logMessageBody = function(apim, loggingTerminal) {
	
    var bodi = apim.getvariable('message.body');
    this.logOutputBody(apim, bodi, loggingTerminal)
}

Api.prototype.logOutputBody = function(apim, bodi, loggingTerminal) {

	try {
		var transactionid = apim.getvariable('message.headers.x-global-transaction-id');
		var bodyPayload = {"x-global-transaction-id":transactionid,  body:bodi, loggingTerminal:loggingTerminal};
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