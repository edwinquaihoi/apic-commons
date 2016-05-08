var currentWorkingDir = java.lang.System.getProperty("user.dir");
var frameworkLocation = currentWorkingDir + '/src/main/js/';
var Require = load('src/main/js/lib/Require.js');
var require = Require( './' , [ frameworkLocation ] );

describe("ApiTest",function() {

	// spy object to replace console
	var console;

	beforeEach(function() {
		console = jasmine.createSpyObj('console',
				[ 'debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency' ]);
	});

	it("testApi", function() {
		
		var config = [
		              {name:"/users",methods:[{name:"GET", targetUrl:"https://randomuser.me/api/users"}]},
		              {name:"/users/all",methods:[{name:"GET", targetUrl:"https://randomuser.me/api/users/all"}]}
		             ];
		var api = require("Api.js").newApi(frameworkLocation,"api","1.0.0", config, require('Logger.js').newLogger(7, console));
		
		expect(api.version).toEqual("1.0.0");
		expect(api.name).toEqual("api");
		expect(api.getOperation("/users").name).toEqual("/users");
		expect(api.getOperation("/users/all").name).toEqual("/users/all");
		expect(api.getOperation("/users").getMethod("GET").targetUrl).toEqual("https://randomuser.me/api/users");
		expect(api.getOperation("/users/all").getMethod("GET").targetUrl).toEqual("https://randomuser.me/api/users/all");
		
	});
	
	it("testApiLogger", function() {
		var config = [
		              {name:"/users",methods:[{name:"GET", targetUrl:"https://randomuser.me/api/users"}]},
		              {name:"/users/all",methods:[{name:"GET", targetUrl:"https://randomuser.me/api/users/all"}]}
		             ];
		var api = require("Api.js").newApi(frameworkLocation,"api","1.0.0", config, require('Logger.js').newLogger(6, console));

		api.logger.info("Hello");
		expect(console.info).toHaveBeenCalledWith("Hello");
	});
});
