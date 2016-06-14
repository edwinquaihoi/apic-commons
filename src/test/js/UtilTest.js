var currentWorkingDir = java.lang.System.getProperty("user.dir");
var frameworkLocation = currentWorkingDir + '/src/main/js/';
var configLocation = currentWorkingDir + '/src/test/js/';
var Require = load('src/main/js/lib/Require.js');
var require = Require( './' , [ frameworkLocation, configLocation ] );

describe("UtilTest",function() {

	// spy object to replace console
	var console;

	beforeEach(function() {
		console = jasmine.createSpyObj('console',
				[ 'debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency' ]);
		console.debug = function(msg) {
			print(msg);
		};
		console.options = function(msg) {
			return this;
		};
	});

	it("testLoadConfig", function() {

		var api = require("Util.js").loadApiConfig(frameworkLocation,configLocation,"PublicSandbox","","", console);
		
		expect(api.version).toEqual("1.0.0");
		expect(api.name).toEqual("TestAPI");
		
		expect(api.getOperation("/users").name).toEqual("/users");
		expect(api.getOperation("/users/all").name).toEqual("/users/all");
		expect(api.getOperation("/users").getMethod("GET").targetUrl).toEqual("https://randomuser.me/api/users");
		expect(api.getOperation("/users/all").getMethod("GET").targetUrl).toEqual("https://randomuser.me/api/users/all");
	});
	
});
