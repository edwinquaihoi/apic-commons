var currentWorkingDir = java.lang.System.getProperty("user.dir");
var frameworkLocation = currentWorkingDir + '/src/main/js/';
var Require = load('src/main/js/lib/Require.js');
var require = Require( './' , [ frameworkLocation ] );

describe("ApiOperationTest",function() {
	it("testApiOperation", function() {
		
		var apiOp = require("ApiOperation.js").newApiOperation(frameworkLocation, "version","/users",[{name:"GET", targetUrl:"https://randomuser.me/api/"},{name:"POST", targetUrl:"https://randomuser.me/apiu/"}]);
		expect(apiOp.apiVersion).toEqual("version");
		expect(apiOp.name).toEqual("/users");
		expect(apiOp.getMethod("GET").targetUrl).toEqual("https://randomuser.me/api/");
		expect(apiOp.getMethod("POST").targetUrl).toEqual("https://randomuser.me/apiu/");
	});
});
