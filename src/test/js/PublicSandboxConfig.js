var name="TestAPI";
var version="1.0.0";
var loggers = {
		generalLogger: { 
			name: "gatewayscript-user",
			logLevel: "7"
		}, 
		splunkLogger: {
			name: "splunkFeed",
			logLevel: "7"
		}
	};

var config = [
              {name:"/users",methods:[{name:"GET", targetUrl:"https://randomuser.me/api/users"}]},
              {name:"/users/all",methods:[{name:"GET", targetUrl:"https://randomuser.me/api/users/all"}]}
             ];

exports.getApiConfig = function(frameworkLocation, console) {

	var util = require(frameworkLocation + 'Util.js');
		
	return util.getApiConfig(frameworkLocation, console, name, version, config, loggers);
}


