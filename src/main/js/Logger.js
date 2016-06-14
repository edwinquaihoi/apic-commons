/**
 * This module is a simple wrapper over console to provide configurable log levels.You supply the module
 * a log level at creation along with a console object. It follows the syslog standard log levels. It uses
 * the logLevel to determine whether to emit the log statement.
 * 
 * 0 - emergency
 * 1 - alert
 * 2 - critical
 * 3 - error
 * 4 - warning
 * 5 - notice
 * 6 - info
 * 7 - debug 
 */
function Logger(logCategory, logLevel, console) {
	this.logLevel = logLevel;
	this.logCategory = logCategory;
	this.console = this.logCategory!= null? console.options({'category':this.logCategory}): console;
	this.logPattern = "";
}

Logger.prototype.isDebug = function() {
	if(this.logLevel > 6) {
		return true;
	}
}

Logger.prototype.debug = function(msg) {
	if(this.logLevel > 6) {
		this.console.debug(msg);
	}
}

Logger.prototype.info = function(msg) {
	if(this.logLevel > 5) {
		this.console.info(msg);
	}
}

Logger.prototype.notice = function(msg) {
	if(this.logLevel > 4) {
		this.console.notice(msg);
	}
}

Logger.prototype.warning = function(msg) {
	if(this.logLevel > 3) {
		this.console.warning(msg);
	}
}

Logger.prototype.error = function(msg) {
	if(this.logLevel > 2) {
		this.console.error(msg);
	}
}

Logger.prototype.critical = function(msg) {
	if(this.logLevel > 1) {
		this.console.critical(msg);
	}
}

Logger.prototype.alert = function(msg) {
	if(this.logLevel > 0) {
		this.console.alert(msg);
	}
}

Logger.prototype.emergency = function(msg) {
	if(this.logLevel == 0) {
		this.console.emergency(msg);
	}
}

/**
 * Integrates into require.js module system.
 */
exports.newLogger = function(loggerConfig, console) {
	return new Logger(loggerConfig.name, loggerConfig.logLevel, console);
}