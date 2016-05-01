var currentWorkingDir = java.lang.System.getProperty("user.dir");
var Require = load('src/main/js/Require.js');
var require = Require( './' , [ currentWorkingDir + '/src/main/js/'] );

describe("ApiVersionTest",function() {
	it("testApiVersion", function() {
		
		var config = [
		              {name:"/users",methods:[{name:"GET", targetUrl:"https://randomuser.me/api/users"}]},
		              {name:"/users/all",methods:[{name:"GET", targetUrl:"https://randomuser.me/api/users/all"}]}
		             ];
		var apiVersion = require("ApiVersion.js").newApiVersion("api","1.0.0", config, "info");
		
		expect(apiVersion.version).toEqual("1.0.0");
		expect(apiVersion.name).toEqual("api");
		expect(apiVersion.getOperation("/users").name).toEqual("/users");
		expect(apiVersion.getOperation("/users/all").name).toEqual("/users/all");
		expect(apiVersion.getOperation("/users").getMethod("GET").targetUrl).toEqual("https://randomuser.me/api/users");
		expect(apiVersion.getOperation("/users/all").getMethod("GET").targetUrl).toEqual("https://randomuser.me/api/users/all");
		
		//console.log(JSON.stringify(apiVersion));
	});
});
