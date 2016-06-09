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
	this.statusCodesMap = [];
	this.providersMap = [];
	
	var apiOperationCreator = require(frameworkLocation + "ApiOperation.js"); 

	// loop through operationMap and make and index map
	for (var i = 0; i < operationMap.length; i++) {
		var op = apiOperationCreator.newApiOperation(frameworkLocation,this, operationMap[i].name, operationMap[i].methods);
		this.operationMap[operationMap[i].name] = op;
	}
	
	// loop through statusCodesArray and make and index map
	var statusCodeAccessor = require(frameworkLocation + "StatusCode.js"); 
	for (var i = 0; i < statusCodeAccessor.statusCodes.length; i++) {
		var statusCodeObj = statusCodeAccessor.statusCodes[i];
		this.statusCodesMap[statusCodeObj.statusCode] = statusCodeObj;
	}	
	// loop through providersArray and make and index map
	for (var i = 0; i < statusCodeAccessor.maps.length; i++) {
		var providerObj = statusCodeAccessor.maps[i];
		providerObj.errorCodesMap = [];
		if(providerObj.codes != null) {
			for (var j = 0; j < providerObj.codes.length; j++) {
				var errorCodeObj = providerObj.codes[j];
				providerObj.errorCodesMap[errorCodeObj.code] = errorCodeObj;			
			}
		}			
		this.providersMap[providerObj.provider] = providerObj;
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

/**
 * Gets an statusCode by status code name.
 * @param name the name of the statusCode.
 * @returns a statusCode
 */
Api.prototype.getStatusCodeObject = function(name) {
	return this.statusCodesMap[name];
}

/**
 * Gets an errorCodeObject by provider and error code.
 * @returns error code mapping object with error code name and status code name.
 */
Api.prototype.getErrorCodeObject = function(providerInput, codeInput) {
	var provider = this.providersMap[providerInput];
	var code = provider != null? provider.errorCodesMap[codeInput] : null;
	return code;
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
	}
}

Api.prototype.logMessageBody = function(apim, loggingTerminal) {
	
    var bodi = apim.getvariable('message.body');
    this.logOutputBody(apim, bodi, loggingTerminal)
}

Api.prototype.logException = function(apim, e, loggingTerminal) {
	try {
		var transactionid = apim.getvariable('message.headers.x-global-transaction-id');
		var exception = {"x-global-transaction-id":transactionid, loggingTerminal:loggingTerminal, exception:e.toString()};
		var str = JSON.stringify(exception);
		var str = this.mask(str);
		this.logger.error(str);
	} catch(ex) {
		this.logger.error(ex);
	}
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
	maskedStr = maskedStr.replace(/(?:"(refNum|referenceNumber)"\s*:\s*")\b(\d{4})\d+(\d{4})\b/ig, '"$1": "$2xxxxxxxx$3');
	
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
	var code = this.getErrorCodeObject(providerInput, codeInput);
	var statusCode = code != null ? this.getStatusCodeObject(code.statusCode) : null;
	if(statusCode == null) {
		statusCode = this.getStatusCodeObject('Unknown');
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