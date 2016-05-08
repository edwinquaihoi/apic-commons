exports.loadApiConfig = function(frameworkLocation,configLocation, catalog, name, version, console) {

	// get the catalog configuration
	
	var configModuleLocation = configLocation + name + catalog + 'Config';
	if(version !== '') {
		configModuleLocation = configModuleLocation + '-' + version + '.js';
	} else {
		configModuleLocation = configModuleLocation + '.js';
	}
	
	console.debug("configModuleLocation="+configModuleLocation);
	
	var catalogConfig;
	try {
		catalogConfig = require(configModuleLocation);
	} catch(e) {
		console.debug(e);
		return null;
	}
	
	return catalogConfig.getApiConfig(frameworkLocation, console);				
};

exports.getApiConfig = function(frameworkLocation, console, name, version, config, logLevel) {

	var logCreator = require(frameworkLocation + 'Logger.js');	
	var logger = logCreator.newLogger(logLevel,console);	
	
	var apiVersionCreator = require(frameworkLocation + 'ApiVersion.js');
	var apiVersion = apiVersionCreator.newApiVersion(frameworkLocation, name, version, config, logger);
		
	return apiVersion;
};