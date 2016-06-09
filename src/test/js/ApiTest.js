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
		console.error.and.callFake(log);
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

		api.logger.error("Hello");
		expect(console.error).toHaveBeenCalledWith("Hello");
	});
	
	it("testLogAuditData", function() {
		var api = require("Api.js").newApi(frameworkLocation,"api","1.0.0", config, require('Logger.js').newLogger(7, console));
		
		// mock object to simulate apim global variable
		var headerz = {header1:'header1',header2:'header2'}; 
		var headers = {headers:headerz};
		apim.getvariable.and.callFake(function(variable) {			
			if(variable =='message.headers') { 				
				return headers;
			} else if(variable == 'message.headers.x-global-transaction-id') {
				return "56955";
			}
			return null;
		});
		var expected = {"x-global-transaction-id":"56955",  logPointId:"Response", "audit":{"orgname":null,"api":null,"apiversion":null,"requesturi":null,"clientappname":null,"clientid":null,"datetime":null},"headers":headerz};
		
		api.logAuditData(apim, 'Response');
		expect(console.notice).toHaveBeenCalledWith(JSON.stringify(expected));
		expect(apim.getvariable).toHaveBeenCalledWith('message.headers');
	});

	it("testLogPayload", function() {
		var api = require("Api.js").newApi(frameworkLocation,"api","1.0.0", config, require('Logger.js').newLogger(7, console));
		
		// mock object to simulate apim global variable
		var bodi = {body1:'body1',body2:'body2'}; 
		var body = {body:bodi};		
		
		apim.getvariable.and.callFake(function(variable) {			
			if(variable == 'message.body') {
				return bodi;
			} else if(variable == 'message.headers.x-global-transaction-id') {
				return "56955";
			}
			return null;
		});
		var expected = {"x-global-transaction-id":"56955",  logPointId:"Response", payload:bodi };
		
		api.logPayload(apim, 'Response');
		expect(console.debug).toHaveBeenCalledWith(JSON.stringify(expected));
		expect(apim.getvariable).toHaveBeenCalledWith('message.body');
	});
	
	it("testLogException", function() {
		var api = require("Api.js").newApi(frameworkLocation,"api","1.0.0", config, require('Logger.js').newLogger(7, console));
		
		apim.getvariable.and.callFake(function(variable) {			
			if(variable == 'message.headers.x-global-transaction-id') {
				return "56955";
			}
			return null;
		});	
		var e1 = null;
		try {
			var myTry = new ExceptinoCreatorFakeClass();
		}catch(e) {
			e1 = e.toString();
			api.logException(apim, e, 'Response');
		}
		
		//{"x-global-transaction-id":"56955","loggingTerminal":"Response","exception":"ReferenceError: \"ExceptinoCreatorFakeClass\" is not defined"}
		var expected = {"x-global-transaction-id":"56955",  logPointId:"Response", exception:e1 };
		expect(console.error).toHaveBeenCalledWith(JSON.stringify(expected));
	});
});
