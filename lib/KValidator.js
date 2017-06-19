const parser = require('./rule-parser')
const test = require('./test')
const Result = require('./Result')

function KValidator(rules, mixins) {
  const _result = Result(this)
  const _test = test    // pre-loaded test functions
  
  let _rules = rules
  let _events = []    // list of events for validation
  let _validate = undefined
  let _data = {}      // data to be tested
  let _options = {}   // container for available parameters for each test declaration
  _options.tested = {}  // tested cache
  
  // make a function availabe in test functions
  let _mixins = mixins || {}

  // mixin: include message if validation fail
  _mixins["message"] = function(result, message) {
    // return back the result to caller test function
    return _result.message(result, message, _options.parameter)
  }

  _init(_rules, _mixins);

// -----------------------------------------------------------------

  function _init(rules, mixins) {
    setRules(rules)
    mix(mixins)
  }


  function mix(mixins) {
    for(key in mixins) {
      _options[key] = mixins[key]
    } 
  }


  function defineTest(slug, fn) {
    _test[slug] = fn
  }


  function setRules (rules) {
    // reset events
    _events = []
    // replace rules
    _rules = rules
    for(key in rules) {
      parser(rules[key], (slug, condition) => {
        _addEvent(_test[slug], slug, condition, key)
      })
    }
    _compile()
  }


  function _addEvent(fn, slug, condition, parameter) {
    // let token = `if(this._rules["${parameter}"].match(/${slug}/)) {\n`
    let token = `_options.value = _data["${parameter}"];\n`
      token += `_options.parameter = "${parameter}";\n`
      token += `_options.condition = "${condition}";\n`
      
      // include test function result in tested
      token += `_options.tested["${slug}"] = _test["${slug}"](_options);\n`
      // create a result summary for tested parameter
      token += `_result.add("${parameter}","${slug}", _options.tested["${slug}"]);\n`
      // clean _options [value, parameter, condition]
      token += `_resetOptions();\n`

    _events.push(token)
  }


  function _compile() {
    // after calling a test function, reset tested events cache
    _events.push('_options.tested = {};')
    // push the result in _result stack
    _events.push('_result.log()')
    // create the validation function
    _validate = new Function('_options, _data, _test, _result, _resetOptions', _events.join('\n'))
  }


  // after each test reset needed options
  function _resetOptions() {
    _options.value = undefined
    _options.parameter = undefined
    _options.condition = undefined
  }


  function validate(data) {
    // change data to be tested
    _data = data
    // run compiled validation function
    if(_validate) _validate(_options, _data, _test, _result, _resetOptions)
  }


  function validateArray(arr) {
    // O(n)
    arr.forEach(data => validate(data))
  }


  return {
    validate,
    validateArray,
    setRules,
    mix,
    defineTest,
    errors: _result.errors,
    fail: _result.count,
    invalid: _result.invalid
  }

}

module.exports = KValidator