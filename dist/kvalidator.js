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
	var Builder = __webpack_require__(6);

	exports.Validator = Validator;
	exports.Builder = Builder;

	var KValidator = window.KValidator = exports;
	/*
	  Example:
	  
	  const KValidator = require("kvalidator")
	  const rules = {
	    name: 'string|max:30|min:3|required',
	    age: 'int|min:18|max:99|required'
	  }

	  const data = {
	    name: 'reke',
	    age: 18
	  }

	  let builder = KValidator.Builder
	  builder.on('data', function(data) {
	    // run statement, before each validation
	    // eg. data-mutation before validation
	  })

	  builder.on('result', function({
	        data,
	        fail,         // true if violated any rule
	        message,      // violation message
	        index,        // array index
	        stop,         // kill-switch to force-stop the validation process
	        valid         // current validation result (eg. valid.name, valid.age)
	      }))

	  const validator = builder.create(rules)

	  // return: array of error message
	  validator.validate(data)
	*/

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var parser = __webpack_require__(2);
	var test = __webpack_require__(3);
	var Result = __webpack_require__(4);
	var FunctionBuilder = __webpack_require__(5);

	function KValidator(rules, mixins, hooks) {
	  var _result = Result(kill_switch);
	  var _test = test; // pre-loaded test functions

	  // validation function builder
	  var _fn = FunctionBuilder(
	  // params to pipe KValidator variables to validation function
	  '_options', '_data', '_test', '_result', '_resetOptions', '_hooks');

	  // validator hooks eg: validator.on('result', cb)
	  var _hooks = hooks;
	  // validation rules
	  var _rules = rules;
	  // validation function handler
	  var _validate = undefined;
	  // kill-switch
	  var _run = true;
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

	  _init(_rules, _mixins, _hooks);

	  // -----------------------------------------------------------------

	  function _init(rules, mixins, hooks) {
	    setRules(rules);
	    mix(mixins);
	    /* on-result hook
	     * for each data in array, call hook after validation.
	     * @see Result.pipe for options
	     */
	    if (hooks.result) _result.pipe(hooks.result);
	    // _rebuildBuffer(4)
	  }

	  // function _rebuildBuffer(buffers) {
	  //   let count = buffers
	  //   let token = `var len = data.length / ${buffers};\n`
	  //       token += 'var i = len;\n'
	  //   let chunks = ''
	  //   let iters = ''
	  //   let append = ''
	  //   while(count--) {
	  //     chunks += `var chunk_${count} = data.splice(0, len);\n`
	  //     iters += `validate(chunk_${count}[i]);\n`
	  //   }
	  //   token += chunks
	  //   token += `while(i--) {\n`
	  //   // token += `console.log(chunk_1)\n`
	  //   token += iters
	  //   token += '}'

	  //   _parl = FunctionBuilder('data', 'validate')
	  //           .body(token)
	  //           .build()
	  //   // console.log(_parl.toString())
	  // }


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
	    /* on-data hook
	     * for each data in array, call hook before validation
	     */
	    if (_hooks['data']) _fn.body('_hooks[\'data\'](_data);');
	    // replace rules
	    _rules = rules;
	    for (var key in rules) {
	      // update value parameter being tested
	      _fn.body('_options.value = _data["' + key + '"];');
	      // update parameter name being tested
	      _fn.body('_options.parameter = "' + key + '";\n');
	      // parse rules
	      parser(rules[key], function (slug, condition) {
	        _fn.body(_addEvent(slug, condition, key, rules[key]));
	      });
	      // clean _options.tested after validating each key
	      _fn.body('_options.tested = {};');
	    }
	    _compile();
	  }

	  // private: _addEvent
	  // create the script for validation function
	  function _addEvent(slug, condition, parameter, rules) {
	    // let token = `if(this._rules["${parameter}"].match(/${slug}/)) {\n`
	    var required = rules.match(/required/);
	    var token = '';

	    // optimize validation for non-required parameters
	    if (!required) token += 'if(_options.value) {\n';
	    // update condition
	    token += '_options.condition = ' + condition + ';\n';
	    // include test function result in tested
	    token += '_options.tested["' + slug + '"] = _test["' + slug + '"](_options);\n';
	    // create a result summary for tested parameter
	    token += '_result.add("' + parameter + '","' + slug + '", _options.tested["' + slug + '"]);\n';
	    // clean _options [value, parameter, condition]
	    token += '_resetOptions();\n';
	    if (!required) token += '}';

	    return token;
	  }

	  // create the validation function
	  function _compile() {
	    // push the result in _result stack, will also run the on-result hook if declared
	    _fn.footer('_result.log(_data);');
	    _validate = _fn.build();
	  }

	  // after each test reset needed options
	  function _resetOptions() {
	    _options.condition = undefined;
	  }

	  // validate single object
	  function validate(data) {
	    // change data to be tested
	    _data = data;
	    // run compiled validation function
	    if (_validate) _validate(_options, _data, _test, _result, _resetOptions, _hooks);
	  }

	  // validate multiple objects, decrement iteration
	  function validateArray(arr) {
	    var i = arr.length;
	    while (--i && _run) {
	      validate(arr[i]);
	    }
	    if (_run) validate(arr[0]);
	    /* on-finish hook
	     * run-once after bulk data validation
	     */
	    if (_hooks.finish) _hooks.finish();
	  }

	  function kill_switch(index) {
	    console.log('Validation kill-switch has been triggered. [index: ' + index + ']');
	    _run = false;
	  }

	  return {
	    validate: validate,
	    validateArray: validateArray,
	    setRules: setRules,
	    mix: mix,
	    defineTest: defineTest,
	    test: _test,
	    errors: _result.errors,
	    fail: _result.count,
	    invalid: _result.invalid,
	    summary: _result.summary,
	    stop: kill_switch
	  };
	}

	var init = function init(rules, mixins, hooks) {
	  if (!rules) return null;
	  var _mixins = mixins || {};
	  var _hooks = hooks || {};
	  return new KValidator(rules, _mixins, _hooks);
	};

	// expose methods
	exports.Validator = KValidator;
	exports.init = init;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	function parse(param, cb) {
	  if (!param) return true;
	  var rules = param.match(/[a-zA-Z0-9]+\:{0,1}([\"a-zA-Z0-9]+)/g);

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

	function Result(stop) {
	  var _kill_switch = stop;

	  var _pipe = undefined; // use heap by default

	  var _current_parameter = null;
	  var _current_result = {};
	  var _current_errors = {};
	  var _current_summary = true;
	  var _current_index = 0;

	  // when using Heap in validation
	  var _count = 0;
	  var _summary_results = [];
	  var _summary_messages = [];

	  function message(result, message, parameter) {
	    parameter = parameter || _count;
	    if (!_current_errors[parameter]) _current_errors[parameter] = [];
	    if (result == false) {
	      _current_errors[parameter].push(message);
	      _count++;
	    }

	    _current_summary = _current_summary && result;
	    // return back the result to test function being called
	    return result;
	  }

	  function errors() {
	    var clone = {};
	    for (var key in _current_errors) {
	      clone[key] = _current_errors[key];
	    }
	    return clone;
	  }

	  // summary
	  function add(parameter, slug, result) {
	    // check if not yet tested
	    if (_current_result[parameter] === undefined) {
	      // assume true
	      _current_result[parameter] = true;
	    }
	    _current_result[parameter] = _current_result[parameter] && result;
	  }

	  // after each validation
	  function log(data) {
	    // use pipe
	    if (_pipe) {
	      _pipe({
	        data: data,
	        fail: !_current_summary,
	        message: !_current_summary ? _current_errors : null,
	        index: _current_index,
	        stop: _stop,
	        valid: _current_result
	      });
	    }
	    // use heap
	    else {
	        _summary_results.push(_current_result);
	        _summary_messages.push(_current_errors);
	      }
	    // reset current state for next data
	    next();
	  }

	  // forced stop
	  function _stop() {
	    // since log() is being called after each validation, we need to exclude the last result
	    _summary_results.pop();
	    _summary_messages.pop();
	    _count--;
	    _kill_switch(_current_index);
	  }

	  // next index
	  function next() {
	    // reset current state for next data
	    _current_result = {};
	    _current_errors = {};
	    _current_summary = true;
	    _current_index++;
	  }

	  // after each validation call _pipe
	  function pipe(fn) {
	    _pipe = fn;
	  }

	  // returns array of validation message
	  function errors() {
	    if (_summary_messages.length > 1) return [].concat(_summary_messages);

	    return _summary_messages[0];
	  }

	  // returns array of validation summary
	  function summary() {
	    if (_summary_results.length > 1) return [].concat(_summary_results);

	    return _summary_results[0];
	  }

	  // check if parameter is invalid
	  function invalid(parameter, index) {
	    var i = index || 0;
	    return _summary_results[i] ? !_summary_results[i][parameter] : undefined;
	  }

	  // count of errors
	  function count() {
	    return _count;
	  }

	  function getIndex() {
	    return _current_index;
	  }

	  return {
	    add: add,
	    count: count,
	    errors: errors,
	    getIndex: getIndex,
	    invalid: invalid,
	    log: log,
	    message: message,
	    next: next,
	    pipe: pipe,
	    summary: summary
	  };
	}

	module.exports = Result;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Validator = __webpack_require__(1);

	function KValidatorBuilder() {
	  var _rules = undefined;
	  var _validator = undefined;
	  var _mixins = {};
	  var _hooks = {
	    'data': undefined,
	    'result': undefined,
	    'finish': undefined
	  };

	  function on(slug, fn) {
	    if (_hooks.hasOwnProperty(slug)) {
	      console.log('kvalidator-hooks["' + slug + '"] : [Function:' + (fn.name || "Anonymous") + ']');
	      _hooks[slug] = fn;
	    }
	    return this;
	  }

	  function mix(slug, fn) {
	    if (typeof slug == 'string' && typeof fn == 'function') _mixins[slug] = fn;
	    return this;
	  }

	  function mixins(obj) {
	    for (var key in mixins) {
	      mix(key, mixins[key]);
	    }
	  }

	  function create(rules) {
	    _rules = rules;
	    return Validator.init(_rules, _mixins, _hooks);
	  }

	  return {
	    on: on,
	    mix: mix,
	    mixins: mixins,
	    create: create
	  };
	}

	module.exports = exports = new KValidatorBuilder();

/***/ }
/******/ ]);