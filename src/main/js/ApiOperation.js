	
function ApiOperation(frameworkLocation, apiVersion, name, methodMap) {
	
	this.apiVersion = apiVersion;
	this.name = name;
	this.methodMap = [];
	
	var apiMethodCreator = require(frameworkLocation + "ApiMethod.js"); 

	// loop through methodMap and make and index map
	for (var i = 0; i < methodMap.length; i++) {
		var method = apiMethodCreator.newApiMethod(this, methodMap[i].name, {targetUrl:methodMap[i].targetUrl});
		this.methodMap[methodMap[i].name] = method;
	}
}	

ApiOperation.prototype.getMethod = 	function(method) {
	return this.methodMap[method];
}

exports.newApiOperation = function(frameworkLocation,apiVersion, name, methodMap) {
	return new ApiOperation(frameworkLocation,apiVersion, name, methodMap);
}