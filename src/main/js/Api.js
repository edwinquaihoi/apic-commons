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
		var bodyPayload = {"x-global-transaction-id":transactionid, loggingTerminal:loggingTerminal, body:bodi};
		var str = JSON.stringify(bodyPayload);
		var str = this.mask(str);
		this.logger.debug(str);
	} catch(e) {
		this.logger.error(e);
		throw e;
	}
}

/**
 * Masks the given string based on regular expressions
 * @param str String to be masked
 */
Api.prototype.mask = function(str) {
	var maskedStr = str;
	
	// Mask credit card account number
	maskedStr = maskedStr.replace(/\b(\d{12})(\d{4})\b/ig, 'xxxxxxxxxxxx$2');	
	// Mask reference number
	maskedStr = maskedStr.replace(/(?:"(refNum|referenceNumber)"\s*:\s*")\b(\d{4})\d+(\d{4})\b/ig, '"$1": $2xxxxxxxx$3');
	
	return maskedStr;
}


/**
 * Returns required object from array based on specified property
 * @param arr Array
 * @param property name of the property
 * @param value of the property to match
 * @return found object from the array
 */
Api.prototype.getByValue = function(arr, property, value) {
	  var result  = arr.filter(function(o){return o[property] == value;} );
	  return result!= null? result[0] : null; // or undefined
}

/**
 * Map the business error to specific HTTP error and status code 
 * @param provider provider name
 * @param code error code from provider
 * @return HTTP Status Code object
 */
Api.prototype.getErrorCode = function(frameworkLocation, providerInput, codeInput) {
	var statusCodeAccessor = require(frameworkLocation + "StatusCode.js"); 
	var provider = statusCodeAccessor!= null ? this.getByValue(statusCodeAccessor.maps, 'provider', providerInput) : null;
	var code = provider != null? this.getByValue(provider.codes, 'code', codeInput) : null;
	var statusCode = code != null ? this.getByValue(statusCodeAccessor.statusCodes, 'statusCode', code.statusCode) : null;
	if(statusCodeAccessor != null && statusCode == null) {
		statusCode = this.getByValue(statusCodeAccessor.statusCodes, 'statusCode', 'Unknown');
	}
	return statusCode;
}

Api.prototype.generateBusinessError = function(frameworkLocation, apim, provider, code) {
	var statusCode = this.getErrorCode(frameworkLocation, provider, code);
	apim.setvariable('message.status.code', statusCode.httpCode);
	return statusCode;
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