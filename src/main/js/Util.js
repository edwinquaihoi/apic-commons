/**
 * A helper method used to simplify loading of an API's configuration during API execution. Gateway scripts the API 
 * assembly will make use of this method to load the appropriate version of an API's config.
 * @param frameworkLocation the dir in which framework modules should be found
 * @param configLocation the dir in which the config file should be found
 * @param catalog the name of the catalog used to locate the appropriate config file
 * @param name the name of the API, used to locate the appropriate config file
 * @param version the version of the API, used to locate the appropriate config file
 * @param console a console object to be used by the framework Logger module
 */
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

	console.debug('Logger:'+logger);
	
	var apiCreator = require(frameworkLocation + 'Api.js');
	var api = apiCreator.newApi(frameworkLocation, name, version, config, logger);
		
	console.debug('Api:' + api);

	return api;
};