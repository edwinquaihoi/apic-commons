var currentWorkingDir = java.lang.System.getProperty("user.dir");
var frameworkLocation = currentWorkingDir + '/src/main/js/';
var Require = load('src/main/js/lib/Require.js');
var require = Require( './' , [ frameworkLocation ] );

describe("StatusCodeTest",function() {

	// spy object to replace console
	var console;
	var apim;
	var config = [
	              {name:"/users",methods:[{name:"GET", targetUrl:"https://randomuser.me/api/users"}]},
	              {name:"/users/all",methods:[{name:"GET", targetUrl:"https://randomuser.me/api/users/all"}]}
	             ];

	beforeEach(function() {
		console = jasmine.createSpyObj('console',
				[ 'debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency' ]);
		
		apim = jasmine.createSpyObj('apim',['getvariable']);
		
		var log = function(msg) {
			print(msg);
		}
				
		console.info.and.callFake(log);
		console.notice.and.callFake(log);
		console.debug.and.callFake(log);
	});

	it("testGetByValue", function() {
		var api = require("Api.js").newApi(frameworkLocation,"api","1.0.0", config, require('Logger.js').newLogger(7, console));
		var arr = require("StatusCode.js").statusCodes;
		var value = api.getByValue(arr, 'statusCode', '11029');
		api.logger.info("value"+ JSON.stringify(value));
		
		expect(value).toBeDefined();
		expect(value.statusCode).toEqual("11029");
		
	});
	
	it("testGetErrorCode", function() {
		var api = require("Api.js").newApi(frameworkLocation,"api","1.0.0", config, require('Logger.js').newLogger(7, console));
		var value = api.getErrorCode(frameworkLocation, 'Oracle MSL','80064');
		api.logger.info("value"+ JSON.stringify(value));
		
		expect(value).toBeDefined();
		expect(value.statusCode).toEqual("11040");
		
	});
	
	
});
