exports.loadApiConfig = function(frameworkLocation,configLocation, catalog, name, version, console) {

	// get the catalog configuration
	
	var configModuleLocation = configLocation + catalog + name + 'Config';
	if(version != '') {
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