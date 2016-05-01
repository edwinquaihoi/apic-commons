var currentWorkingDir = java.lang.System.getProperty("user.dir");
var Require = load('src/main/js/Require.js');
var require = Require('./', [ currentWorkingDir + '/src/main/js/' ]);

describe("LoggerTest", function() {

	// spy object to replace console
	var console;

	beforeEach(function() {
		console = jasmine.createSpyObj('console',
				[ 'debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency' ]);
	});

	it("testDebug", function() {
		var logger = require('Logger.js').newLogger(7, console);
		
		logger.debug("Hello");
		
		// ensure that console.debug was called...
		expect(console.debug).toBeDefined();
		expect(console.debug).toHaveBeenCalled();
		expect(console.debug).toHaveBeenCalledWith("Hello");
		
	});

	it("testInfo", function() {
		var logger = require('Logger.js').newLogger(6, console);
		
		logger.debug("Hello");
		logger.info("Hello");
		
		// ensure that console.debug was not called...
		expect(console.debug).not.toHaveBeenCalledWith("Hello");
		expect(console.info).toHaveBeenCalledWith("Hello");
		
	});

	it("testNotice", function() {
		var logger = require('Logger.js').newLogger(5, console);
		
		logger.debug("Hello");
		logger.info("Hello");
		logger.notice("Hello");
		
		// ensure that console.debug was not called...
		expect(console.debug).not.toHaveBeenCalledWith("Hello");
		expect(console.info).not.toHaveBeenCalledWith("Hello");
		expect(console.notice).toHaveBeenCalledWith("Hello");
		
	});
});
