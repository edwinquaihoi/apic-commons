/**
 * This module represents a APIC API definition.
 * @param frameworkLocation the location from which to load other framework modules.
 * @param name the name of the API
 * @param version the version of the API
 * @param operationMap a multi dimensional array containing operations that belong to the API.
 * @param logger a Logger object which is used by framework code to log.
 */	
function Api(frameworkLocation, name, version, operationMap, logger, splunkLogger) {
	
	this.name = name;
	this.version = version;
	this.operationMap = [];
	this.logger = logger;
	this.splunkLogger = splunkLogger;
	
	var apiOperationCreator = require(frameworkLocation + "ApiOperation.js"); 

	// loop through operationMap and make and index map
	for (var i = 0; i < operationMap.length; i++) {
		var op = apiOperationCreator.newApiOperation(frameworkLocation,this, operationMap[i].name, operationMap[i].methods);
		this.operationMap[operationMap[i].name] = op;
	}
}	

Api.prototype.setConfigLocation = function(configLocation) {
	this.configLocation = configLocation;
	try {
		this.transformer = require(configLocation + 'Transformations.js');
		this.statusCodeAccessor = require(configLocation + "StatusCodes.js");
	}catch(e) {
		this.logger.error(e);
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

Api.prototype.getTransactionId = function(apim) {
	var transactionid = apim.getvariable('transaction-id');
	if(transactionid == null) {
		transactionid = apim.getvariable('message.headers.x-global-transaction-id');
	}
	return transactionid;
}

Api.prototype.logAuditData = function(apim, logPointId) {
	
	// get the message headers
	try {
		var transactionid = this.getTransactionId(apim);
		var log = {"transaction-id":transactionid, logPointId:logPointId};
		var audit = {};
		audit.apiName = apim.getvariable('api.name');
		audit.apiBasePath = apim.getvariable('api.root');
		audit.apiVersion = apim.getvariable('api.version');
		audit.apiOrg = apim.getvariable('api.org.name');
		audit.apiOrgId = apim.getvariable('api.org.id');
		audit.requestVerb = apim.getvariable('request.verb');
		audit.requestUri = apim.getvariable('request.uri');
		audit.gateway = apim.getvariable('api.endpoint.address');
		audit.gatewayHostName = apim.getvariable('api.endpoint.hostname');
		audit.plan = apim.getvariable('plan.name');
		audit.clientApp = apim.getvariable('client.app.name');
		audit.clientAppId = apim.getvariable('client.app.id');	
		audit.clientOrg = apim.getvariable('client.org.name');
		audit.clientOrgId = apim.getvariable('client.org.id');
		audit.datetime = apim.getvariable('system.datetime');
		log.audit = audit;
		log.headers = apim.getvariable('message.headers').headers;
		this.splunkLogger.notice(JSON.stringify(log));
	} catch(e) {
		this.logger.error(e);
	}
}

Api.prototype.logPayload = function(apim, logPointId) {
	
    var bodi = apim.getvariable('message.body');
    this.logOutputMessage(apim, bodi, logPointId)
}

Api.prototype.logException = function(apim, e, logPointId) {
	try {
		var transactionid = this.getTransactionId(apim);
		var exception = {"transaction-id":transactionid, logPointId:logPointId, exception:e.toString()};
		var str = JSON.stringify(exception);
		var str = this.mask(str);
		this.splunkLogger.error(str);
	} catch(ex) {
		this.logger.error(ex);
	}
}

Api.prototype.logOutputMessage = function(apim, bodi, logPointId) {

	try {
		var transactionid = this.getTransactionId(apim);
		var bodyPayload = {"transaction-id":transactionid, logPointId:logPointId, payload:bodi};
		var str = JSON.stringify(bodyPayload);
		var str = this.mask(str);
		this.splunkLogger.debug(str);
	} catch(e) {
		this.logger.error(e);
	}
}

/**
 * Masks the given string based on regular expressions
 * @param str String to be masked
 */
Api.prototype.mask = function(str) {
	// You can write your common masks on str here before application specific masking is done.

	// Execute application specific masks
	return this.transformer != null && this.transformer.mask != null && typeof this.transformer.mask === "function"? this.transformer.mask(str) : str;	
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
 * Gets an statusCode by status code name.
 * @param name the name of the statusCode.
 * @returns a statusCode
 */
Api.prototype.getStatusCodeObject = function(name) {
	if(this.statusCodeAccessor == null || name == 'Unknown') {
		// Return a default status code object in case there is no StatusCodes.js
		var defaultCode = {
				"httpCode" : "400",
				"status" : {
					"statusCode" : "Unknown",
					"severity" : "Error",
					"statusDesc" : "Internal Error"
				}
			};
		return defaultCode;
	}
	if(this.statusCodesMap == null) {
		this.statusCodesMap = [];
		// loop through statusCodesArray and make and index map		
		for (var i = 0; i < this.statusCodeAccessor.statusCodes.length; i++) {
			var statusCodeObj = this.statusCodeAccessor.statusCodes[i];
			this.statusCodesMap[statusCodeObj.status.statusCode] = statusCodeObj;
		}	
	}	
	
	return this.statusCodesMap[name];
}

/**
 * Gets an errorCodeObject by provider and error code.
 * @returns error code mapping object with error code name and status code name.
 */
Api.prototype.getErrorCodeObject = function(providerInput, codeInput) {
	
	if(this.statusCodeAccessor == null) 
		return null;
	
	if(this.providersMap == null) {
		this.providersMap = [];
		// loop through providersArray and make and index map
		for (var i = 0; i < this.statusCodeAccessor.maps.length; i++) {
			var providerObj = this.statusCodeAccessor.maps[i];
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
	
	var provider = this.providersMap[providerInput];
	var code = provider != null? provider.errorCodesMap[codeInput] : null;
	return code;
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
	return  {status: statusCode.status};
}


Api.prototype.getOperationMap = function(apim) {
	return this.operationMap;
}


/**
 * Integrates into require.js module system.
 */
exports.newApi= function(frameworkLocation,name, version, operationMap, logger, splunkLogger) {
	return new Api(frameworkLocation,name, version, operationMap, logger, splunkLogger);
}