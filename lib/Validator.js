const parser = require('./rule-parser')
const test = require('./test')

function Validator (rules) {

	const _test = test
	const _rules = rules

	var _tested = {}	// tested rules cache for each data[key]
	var _errors = []	// error message container for each test in data[key]


	function _message(result, message) {
		if(result == false)
			_errors.push(message)
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
	}


	function validate(data) {
		for(key in data) {
			_tested = {}
			parser(key, _rules[key], data[key], _compile)
		}
		// return test results messages
		return _errors
	}


	return {
		defineTest,
		_test,
		validate
	}

}

module.exports = Validator