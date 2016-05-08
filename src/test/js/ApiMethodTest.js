var currentWorkingDir = java.lang.System.getProperty("user.dir");
var Require = load('src/main/js/lib/Require.js');
var require = Require( './' , [ currentWorkingDir + '/src/main/js/'] );

describe("ApiMethodTest",function() {
	it("testApiMethod", function() {
				
		var apiMethod = require("ApiMethod.js").newApiMethod("operation","GET",{targetUrl:"https://randomuser.me/api/"});
		expect(apiMethod.apiOperation).toEqual("operation");
		expect(apiMethod.name).toEqual("GET");
		expect(apiMethod.targetUrl).toEqual("https://randomuser.me/api/");
	});
});
