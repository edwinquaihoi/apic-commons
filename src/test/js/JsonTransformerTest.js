var currentWorkingDir = java.lang.System.getProperty("user.dir");
var frameworkLocation = currentWorkingDir + '/src/main/js/';
var configLocation = currentWorkingDir + '/src/test/js/';
var Require = load('src/main/js/lib/Require.js');
var require = Require('./', [ frameworkLocation, configLocation ]);

describe("JsonTransformerTest", function() {

	// spy object to replace console
	var console;
	var api;

	beforeEach(function() {
		console = jasmine.createSpyObj('console', [ 'debug', 'info', 'notice',
				'warning', 'error', 'critical', 'alert', 'emergency' ]);
		apim = jasmine.createSpyObj('apim', [ 'getvariable' ]);

		var log = function(msg) {
			print(msg);
		}

		console.info.and.callFake(log);
		console.notice.and.callFake(log);
		console.debug.and.callFake(log);
		console.error.and.callFake(log);
	});

	it("testTransform", function() {
		try {
			var jsonTransformer = require("JsonTransformer.js")
					.newJsonTransformer(frameworkLocation);

			var template = {
				foo : [ '$.some.crazy', {
					bar : '$.example'
				} ]
			};

			var data = {
				some : {
					crazy : [ {
						example : 'A'
					}, {
						example : 'B'
					} ]
				}
			};

			var result = jsonTransformer.transform(data, template);
			var expectedResults = '{"foo":[{"bar":"A"},{"bar":"B"}]}';
			var actualResults = JSON.stringify(result);
			
			expect(expectedResults).toBe(actualResults);
			
			console.info('actual:'+actualResults);
			console.info('expected:'+expectedResults);
				
		} catch (e) {
			console.info(e);
			throw e;
		}
	});

});
