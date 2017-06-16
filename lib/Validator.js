const parser = require('./rule-parser')
const test = require('./test')

function Validator (rules) {

	// contains assertion functions
	const _test = test

	// the given rules for validation
	const _rules = rules

	// contains the sum of boolean results for each parameter
	var _results = {}	
	
	// error message container for each test in data[key]
	var _errors = {}

	// tested rules cache for each data[key]
	var _tested = {}

	// temporary container for currently tested parameter name
	var _current_param = null

	var error_count = 0

	function _message(result, message) {
		if(!_errors[_current_param])
			_errors[_current_param] = []
		if(result == false) {
			_errors[_current_param].push(message)
			error_count ++
		}

		// return back the result to test function being called
		return result
	}


	function defineTest (slug, fn) {
		// override the existing test function
		_test[slug] = fn
		// append test function if exist
		// if (_test[slug] != undefined) {
		// 	if(toString.call(_test[slug]).match('Array')) {
		// 		_test[slug].push(fn)
		// 	}
		// 	else {
		// 		let list = []
		// 		list.push(_test[slug], fn)
		// 		_test[slug] = list
		// 	}
		// } else {
		// 	_test[slug] = fn
		// }
	}


	function _compile(param_name, rule, value) {
		// separate slug and value (eg. min:30)
		let [slug, option] = rule.split(':')
		// available params in test function declaration
		let options = {
			value,
			option,
			slug,
			parameter: param_name,
			tested: _tested,
			message: _message
		}
		// log tested rules with results
		_tested[slug] = _test[slug](options)
		_appendResult(param_name, _tested[slug])
	}


	function _appendResult(param_name, result) {
		// check if not yet tested
		if(_results[param_name] === undefined) {
			// assume true
			_results[param_name] = true
		}
		
		// sum of boolean results
		_results[param_name] = _results[param_name] && result
	}


	function invalid(param_name) {
		return !_results[param_name]
	}


	function fail() {
		return error_count
	}


	function messages() {
		let clone = {}
		for(key in _errors) {
			if(_errors[key].length > 0) {
				clone[key] = _errors[key]
			}
		}
		return clone
	}


	function validate(data) {
		// reset results
		_results = {}
		for(key in data) {
			// get the record of current parameter in validation
			_current_param = key
			// reset tested rules cache
			_tested = {}
			parser(key, _rules[key], data[key], _compile)
		}
		// return test results messages
		_clean()
		return messages()
	}


	function _clean() {
		_current_param = null
		_tested = {}
	}


	return {
		_test,
		defineTest,
		invalid,
		messages,
		fail,
		validate
	}

}

module.exports = Validator