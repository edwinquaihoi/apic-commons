var currentWorkingDir = java.lang.System.getProperty("user.dir");
var frameworkLocation = currentWorkingDir + '/src/main/js/';
var Require = load('src/main/js/lib/Require.js');
var require = Require( './' , [ frameworkLocation ] );

describe("ApiTest",function() {

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

	it("testApi", function() {
		
		var api = require("Api.js").newApi(frameworkLocation,"api","1.0.0", config, require('Logger.js').newLogger(7, console));
		
		expect(api.version).toEqual("1.0.0");
		expect(api.name).toEqual("api");
		expect(api.getOperation("/users").name).toEqual("/users");
		expect(api.getOperation("/users/all").name).toEqual("/users/all");
		expect(api.getOperation("/users").getMethod("GET").targetUrl).toEqual("https://randomuser.me/api/users");
		expect(api.getOperation("/users/all").getMethod("GET").targetUrl).toEqual("https://randomuser.me/api/users/all");
		
	});
	
	it("testApiLogger", function() {
		var api = require("Api.js").newApi(frameworkLocation,"api","1.0.0", config, require('Logger.js').newLogger(7, console));

		api.logger.info("Hello");
		expect(console.info).toHaveBeenCalledWith("Hello");
	});
	
	it("testLogHeaders", function() {
		var api = require("Api.js").newApi(frameworkLocation,"api","1.0.0", config, require('Logger.js').newLogger(7, console));
		
		// mock object to simulate apim global variable
		var headerz = {header1:'header1',header2:'header2'}; 
		var headers = {headers:headerz};
		
		apim.getvariable.and.callFake(function(variable) {			
			return headerz;
		});
		
		api.logHeaders(apim);
		expect(console.notice).toHaveBeenCalledWith(JSON.stringify(headers));
		expect(apim.getvariable).toHaveBeenCalledWith('message.headers');
	});

	it("testLogBody", function() {
		var api = require("Api.js").newApi(frameworkLocation,"api","1.0.0", config, require('Logger.js').newLogger(7, console));
		
		// mock object to simulate apim global variable
		var bodi = {body1:'body1',body2:'body2'}; 
		var body = {body:bodi};
		
		apim.getvariable.and.callFake(function(variable) {			
			return bodi;
		});
		
		api.logBody(apim);
		expect(console.debug).toHaveBeenCalledWith(JSON.stringify(body));
		expect(apim.getvariable).toHaveBeenCalledWith('message.body');
	});
});
