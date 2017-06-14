const parser = require('./rule-parser')
const test = require('./test')

function Validator (rules) {

	const _test = test
	const _rules = rules

	var _tested = {}	// tested rules cache for each data[key]
	var _errors = []	// error message container for each test in data[key]

	function addTest (slug, fn) {
		if (_test[slug] != undefined) {
			if(toString.call(_test[slug]).match('Array')) {
				_test[slug].push(fn)
			}
			else {
				let list = []
				list.push(_test[slug], fn)
				_test[slug] = list
			}
		} else {
			_test[slug] = fn
		}
	}

	function _compile(param_name, rule, data) {
		// separate slug and value (eg. min:30)
		let [slug, option] = rule.split(':')
		// available params in test function declaration
		let options = {
			data,
			option,
			slug: param_name,
			tested: _tested,
			message: _errors
		}
		// log test results
		console.log(_errors)
		_tested[slug] = _test[slug](options)
	}

	function validate(data) {
		let result = {}
		for(key in data) {
			_tested = {}
			parser(key, _rules[key], data[key], _compile)
			result[key] = _tested
		}
		// return test results
		return result
	}

	return {
		addTest,
		_test,
		validate
	}

}

module.exports = Validator