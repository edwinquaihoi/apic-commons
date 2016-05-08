var currentWorkingDir = java.lang.System.getProperty("user.dir");
var frameworkLocation = currentWorkingDir + '/src/main/js/';
var Require = load('src/main/js/Require.js');
var require = Require( './' , [ frameworkLocation ] );

describe("ApiVersionTest",function() {

	// spy object to replace console
	var console;

	beforeEach(function() {
		console = jasmine.createSpyObj('console',
				[ 'debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency' ]);
	});

	it("testApiVersion", function() {
		
		var config = [
		              {name:"/users",methods:[{name:"GET", targetUrl:"https://randomuser.me/api/users"}]},
		              {name:"/users/all",methods:[{name:"GET", targetUrl:"https://randomuser.me/api/users/all"}]}
		             ];
		var apiVersion = require("ApiVersion.js").newApiVersion(frameworkLocation,"api","1.0.0", config, require('Logger.js').newLogger(7, console));
		
		expect(apiVersion.version).toEqual("1.0.0");
		expect(apiVersion.name).toEqual("api");
		expect(apiVersion.getOperation("/users").name).toEqual("/users");
		expect(apiVersion.getOperation("/users/all").name).toEqual("/users/all");
		expect(apiVersion.getOperation("/users").getMethod("GET").targetUrl).toEqual("https://randomuser.me/api/users");
		expect(apiVersion.getOperation("/users/all").getMethod("GET").targetUrl).toEqual("https://randomuser.me/api/users/all");
		
	});
	
	it("testApiLogger", function() {
		var config = [
		              {name:"/users",methods:[{name:"GET", targetUrl:"https://randomuser.me/api/users"}]},
		              {name:"/users/all",methods:[{name:"GET", targetUrl:"https://randomuser.me/api/users/all"}]}
		             ];
		var apiVersion = require("ApiVersion.js").newApiVersion(frameworkLocation,"api","1.0.0", config, require('Logger.js').newLogger(6, console));

		apiVersion.logger.info("Hello");
		expect(console.info).toHaveBeenCalledWith("Hello");
	});
});
