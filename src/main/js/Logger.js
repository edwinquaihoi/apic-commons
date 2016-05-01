function Logger(logLevel, console) {
	this.logLevel = logLevel
	this.console = console;
	this.logPattern = "";
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
		this.console.emergency(msg);alert
	}
}

exports.newLogger = function(logLevel, console) {
	return new Logger(logLevel, console);
}