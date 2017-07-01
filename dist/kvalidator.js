/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Validator = __webpack_require__(1);

	module.exports = exports = Validator;

	// for client browsers
	var KValidator = window.KValidator = Validator;

	/*
	  Example:
	  
	  const Validator = require('../lib/Kvalidator')

	  let data = {
	    age: 18,
	    name: "reke",
	    message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	    address: 'Philippines'
	  }

	  let rules = {
	    name: 'string|min:2|max:5|required',
	    age: 'number|min:10|max:25|required',
	    message: 'string|min:10|max:20',
	    address: 'string|min:30|max:255'
	  }

	  console.log('creating validator..')
	  validator = Validator.create(rules)

	  validator.validate(data)
	  console.log(validator.fail())
	  console.log(validator.errors())
	  console.log(validator.invalid('message'))
	  console.log(validator.summary())
	*/

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/*
	* KValidator
	* author: erric rapsing
	*/

	var parser = __webpack_require__(2);
	var test = __webpack_require__(3);
	var Result = __webpack_require__(4);
	var FunctionBuilder = __webpack_require__(5);

	function KValidator(rules, mixins) {

	  // validator result manager
	  var _result = Result();

	  // pre-load assertions, the user can modify by using the defineTest() method
	  var _test = test;

	  // validation function builder
	  var _fn = FunctionBuilder(
	  // params to pipe KValidator variables to validation function
	  '_options', '_data', '_assert');

	  // validation rules
	  var _rules = rules || {};
	  // validation function handler
	  var _validate = undefined;
	  // // kill-switch
	  // let _run = true
	  // data to be tested
	  var _data = {};
	  // container for available parameters for each test declaration
	  var _options = {};
	  // tested cache
	  _options.tested = {};

	  // function availabe in test functions
	  var _mixins = mixins || {};

	  /*
	  * mixin: include message in available options
	  * inject: _options.parameter to Result.message()
	  * returns boolean result to caller test function
	  */
	  _mixins["message"] = function (result, message) {
	    return _result.message(result, message, _options.parameter);
	  };

	  _init(_rules, _mixins);

	  // -----------------------------------------------------------------

	  function _init(rules, mixins) {
	    setRules(rules);
	    mix(mixins);
	  }

	  // additional options for a test function
	  function mix(mixins) {
	    for (var key in mixins) {
	      _options[key] = mixins[key];
	    }
	  }

	  // define new / override existing assertion function
	  function defineTest(slug, fn) {
	    _test[slug] = fn;
	  }

	  // change rules
	  function setRules(rules) {
	    // replace rules
	    _rules = rules;
	    var required = void 0;

	    for (var key in rules) {
	      required = rules[key].match(/required/);

	      // update value parameter being tested
	      _fn.body('_options.value = _data["' + key + '"];');

	      // update parameter name being tested
	      _fn.body('_options.parameter = "' + key + '";\n');

	      // optimize non-required data
	      if (!required) _fn.body('if(_options.value) {');

	      // parse rules
	      parser(rules[key], function (slug, condition) {
	        _fn.body('_assert("' + key + '", "' + slug + '", ' + condition + ');');
	      });

	      if (!required) _fn.body('}');

	      // clean _options.tested after validating each key
	      _fn.body('_options.tested = {};\n');
	    }
	    _compile();
	  }

	  function _assert(param, rule, condition) {
	    // condition for test function
	    _options.condition = condition;
	    // update tested rules for current key
	    _options.tested[rule] = _test[rule](_options);
	    // log validation result
	    _result.add(param, rule, _options.tested[rule]);
	  }

	  // create the validation function
	  function _compile() {
	    _validate = _fn.build();
	  }

	  // validate single object
	  function validate(data) {
	    // change data to be tested
	    _data = data;
	    // console.log(_validate.toString())
	    // run compiled validation function
	    if (_validate) _validate(_options, _data, _assert);
	  }

	  function validateArray(arr, onResult, cb) {
	    var i = 0;
	    var n = arr.length;
	    var timer = setInterval(function () {
	      while (i < n) {
	        validator.validate(arr[i++]);
	        onResult({ validator: validator, data: _data });
	        validator.next();
	      }
	      if (i == n) {
	        clearInterval(timer);
	        if (cb) cb();
	      }
	    }, 1);
	  }

	  return {
	    validate: validate,
	    validateArray: validateArray,
	    setRules: setRules,
	    mix: mix,
	    defineTest: defineTest,
	    errors: _result.errors,
	    fail: _result.count,
	    invalid: _result.invalid,
	    summary: _result.summary,
	    next: _result.clear
	  };
	}

	var create = function create(rules, mixins) {
	  if (!rules) return null;
	  var _mixins = mixins || {};
	  return new KValidator(rules, _mixins);
	};

	// expose methods
	exports.create = create;
	exports.Validator = KValidator;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	function parse(param, cb) {
	  if (!param) return true;
	  var rules = param.match(/[a-zA-Z0-9_-]+\:{0,1}([\"a-zA-Z0-9]+)/g);

	  rules.forEach(function (rule) {
	    var _rule$split = rule.split(':'),
	        _rule$split2 = _slicedToArray(_rule$split, 2),
	        slug = _rule$split2[0],
	        condition = _rule$split2[1];

	    cb(slug, condition);
	  });
	}

	module.exports = parse;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {

		'string': function string(_ref) {
			var value = _ref.value,
			    parameter = _ref.parameter,
			    message = _ref.message;

			var result = false;
			result = typeof value === 'string';
			return message(result, parameter + ' must be string');
		},

		'number': function number(_ref2) {
			var value = _ref2.value,
			    parameter = _ref2.parameter,
			    message = _ref2.message;

			var result = false;
			result = !!Number(value);
			return message(result, parameter + ' must be a number');
		},

		'min': function min(_ref3) {
			var value = _ref3.value,
			    parameter = _ref3.parameter,
			    condition = _ref3.condition,
			    message = _ref3.message,
			    tested = _ref3.tested;

			var result = false;
			var remarks = '';
			var floor = Number(condition);
			if (!floor) throw new Error('invalid value given in rule "' + parameter + ':' + condition + '"');
			if (tested['string']) {
				result = value.length >= floor;
				remarks = 'characters';
			} else {
				result = value >= floor;
			}
			return message(result, (parameter + ' is less than ' + condition + ' ' + remarks).trim());
		},

		'max': function max(_ref4) {
			var value = _ref4.value,
			    parameter = _ref4.parameter,
			    condition = _ref4.condition,
			    message = _ref4.message,
			    tested = _ref4.tested;

			var result = false;
			var remarks = '';
			var ceil = Number(condition);
			if (!ceil) throw new Error('invalid value given in rule "' + parameter + ':' + condition + '"');
			if (tested['string']) {
				result = value.length <= condition;
				remarks = 'characters';
			} else {
				result = value <= ceil;
			}
			return message(result, (parameter + ' is greater than ' + condition + ' ' + remarks).trim());
		},

		'required': function required(_ref5) {
			var value = _ref5.value,
			    parameter = _ref5.parameter,
			    message = _ref5.message,
			    tested = _ref5.tested;

			var result = false;
			if (tested['string']) {
				result = value.length > 0;
			} else {
				result = value != null && value != undefined;
			}
			return message(result, parameter + ' is required!');
		}

	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	/*
	* KValidator Result
	* author: erric rapsing
	*/

	function Result() {
	  var _pipe = undefined; // use heap by default

	  // let _current_parameter = null
	  var _result = {};
	  var _errors = {};
	  var _summary = true;
	  var _count = 0;

	  function message(result, message, parameter) {
	    parameter = parameter || _count;
	    if (!_errors[parameter]) _errors[parameter] = [];
	    if (result == false) {
	      _errors[parameter].push(message);
	      _count++;
	    }

	    _summary = _summary && result;
	    // return back the result to test function being called
	    return result;
	  }

	  function errors(key) {
	    if (key) return _errors[key];
	    // else
	    var clone = {};
	    for (var key in _errors) {
	      clone[key] = _errors[key];
	    }
	    return clone;
	  }

	  // summary
	  function add(parameter, slug, result) {
	    // check if not yet tested
	    if (_result[parameter] === undefined) {
	      // assume true
	      _result[parameter] = true;
	    }
	    // sum of validation results for each key
	    _result[parameter] = _result[parameter] && result;
	  }

	  // clear results for next validation
	  function clear() {
	    // reset current state for next data
	    _result = {};
	    _errors = {};
	    _summary = true;
	  }

	  // returns array of validation message
	  // function errors() {
	  //   return _errors
	  // }

	  // returns array of validation summary
	  function summary() {
	    return _result;
	  }

	  // check if key/parameter is invalid based on rules
	  function invalid(parameter) {
	    return !_result[parameter];
	  }

	  // count of errors
	  function count() {
	    return _count;
	  }

	  return {
	    add: add,
	    count: count,
	    errors: errors,
	    invalid: invalid,
	    message: message,
	    clear: clear,
	    summary: summary
	  };
	}

	module.exports = Result;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	/*
	* FunctionBuilder
	* author: erric rapsing
	*/

	function FunctionBuilder() {
	  var _before = [];
	  var _events = [];
	  var _after = [];

	  for (var _len = arguments.length, param = Array(_len), _key = 0; _key < _len; _key++) {
	    param[_key] = arguments[_key];
	  }

	  var _params = [].concat(param);
	  var _fn_cache = null;
	  var _stack = undefined;

	  // -------------------------------------------------

	  function __append(fn, p, r, auto) {
	    var parameter = p || '';
	    var ret = r || '';

	    if (ret != '') ret += ' = ';

	    if (auto) // prefix ; make sure to close any statement before running
	      _stack.push(';' + ret + '(' + fn + ')(' + parameter + ');');else _stack.push('' + ret + fn);
	  }

	  function head(fn, p, r, auto) {
	    _stack = _before;
	    if (fn) __append(fn.toString(), p, r, auto);
	    return this;
	  }

	  function body(fn, p, r, auto) {
	    _stack = _events;
	    if (fn) __append(fn.toString(), p, r, auto);
	    return this;
	  }

	  function footer(fn, p, r, auto) {
	    _stack = _after;
	    if (fn) __append(fn.toString(), p, r, auto);
	    return this;
	  }

	  function include(fn) {
	    _stack = _stack || _before;
	    __append('//--- Include function: ' + fn.name + '\n' + fn.toString());
	  }

	  function toString() {
	    if (_fn_cache) return _fn_cache.toString();
	    return _before.concat(_events, _after).join('\n');
	  }

	  function build() {
	    // console.log(toString())
	    _fn_cache = new Function(_params.join(), toString());
	    _reset();
	    return _fn_cache;
	  }

	  function _reset() {
	    _before = [];
	    _events = [];
	    _after = [];
	    _params = [];
	    _stack = undefined;
	  }

	  // function params(... param) {
	  //   _params = [].concat(param)
	  // }

	  return {
	    include: include,
	    build: build,
	    // auto,
	    // params,
	    // force,
	    head: head,
	    body: body,
	    footer: footer,
	    toString: toString
	  };
	}

	module.exports = FunctionBuilder;

/***/ }
/******/ ]);