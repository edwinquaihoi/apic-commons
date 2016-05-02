var apiOperationCreator = require("./ApiOperation.js"); 
	
function ApiVersion(name, version, operationMap, logger) {
	
	this.name = name;
	this.version = version;
	this.operationMap = [];
	this.logger = logger;
	
	// loop through operationMap and make and index map
	for (var i = 0; i < operationMap.length; i++) {
		var op = apiOperationCreator.newApiOperation(this, operationMap[i].name, operationMap[i].methods);
		this.operationMap[operationMap[i].name] = op;
	}
}	

ApiVersion.prototype.getOperation = function(name) {
	return this.operationMap[name];
}

ApiVersion.prototype.getOperationMap = function(name) {
	return this.operationMap;
}

exports.newApiVersion = function(name, version, operationMap, logger) {
	return new ApiVersion(name, version, operationMap, logger);
}