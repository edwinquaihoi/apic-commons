function JsonTransformer(frameworkLocation) {	
	this.frameworkLocation = frameworkLocation;
	this.jsonPath = require(frameworkLocation + 'JSONPath.js').newJSONPath();	
}	


JsonTransformer.prototype = {

  /**
   * Determine type of object.
   *
   * @param {object} obj
   * @returns {string}
   */
	type : function (obj) {
		return Array.isArray(obj) ? 'array' : typeof obj;
	},

  /**
   * Get single property from data object.
   *
   * @param {object} data
   * @param {string} pathStr
   * @param {object} result
   * @param {string} key
   */
   seekSingle : function(data, pathStr, result, key) {
    var seek = this.jsonPath.eval(data, pathStr) || [];

    result[key] = seek.length ? seek[0] : undefined;
   },

  /**
   * Get array of properties from data object.
   *
   * @param {object} data
   * @param {array} pathArr
   * @param {object} result
   * @param {string} key
   */
   seekArray : function(data, pathArr, result, key) {

	var subpath = pathArr[1];
    var path = pathArr[0];
	    
    var seek = this.jsonPath.eval(data, path) || [];

	if (seek.length && subpath) {
      result = result[key] = [];

      /*
      seek[0].forEach(function(item, index) {
        this.walk(item, subpath, result, index);
      });
      */
      
      for(var i = 0, len = seek[0].length; i < len; i++) {
    	  this.walk(seek[0][i], subpath, result, i);
      }
    } else {
      result[key] = seek;
    }
   },

   walk : function(data, path, result, key) {
    var fn;
    
    var _type = this.type(path);
    switch (_type) {
      case 'string':
        this.seekSingle(data, path, result, key);
        break;

      case 'array':
        this.seekArray(data, path, result, key);
        break;

      case 'object':
        this.seekObject(data, path, result, key);
        break;
    }
    
    /*
    if (fn) {
      fn(data, path, result, key);
    }
    */
   },

/**
   * Get object property from data object.
   *
   * @param {object} data
   * @param {object} pathObj
   * @param {object} result
   * @param {string} key
   */
   seekObject : function(data, pathObj, result, key) {
	
    if (typeof key !== 'undefined') {
      result = result[key] = {};
    }

    var keys = Object.keys(pathObj);
    
    for (var i = 0, len = keys.length; i < len; i++) {
    	this.walk(data, pathObj[keys[i]], result, keys[i]);
    }
    /*
    Object.keys(pathObj).forEach(function(name) {
      this.walk(data, pathObj[name], result, name);
    }, this);
    */
   },

/**
   * @module jsonpath-object-transform
   * @param {object} data
   * @param {object} path
   * @returns {object}
   */
   transform : function(data, path) {
    var result = {};

    this.walk(data, path, result);

    return result;
   }
};

/**
 * Integrates into require.js module system.
 */
exports.newJsonTransformer = function(frameworkLocation) {
	return new JsonTransformer(frameworkLocation);
}
