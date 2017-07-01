/*
* KValidator
* author: erric rapsing
*/

const parser = require('./rule-parser')
const test = require('./test')
const Result = require('./Result')
const FunctionBuilder = require('./FunctionBuilder')

function KValidator(rules, mixins) {
  
  // validator result manager
  const _result = Result()
  
  // pre-load assertions, the user can modify by using the defineTest() method
  const _test = test    

  // validation function builder
  const _fn = FunctionBuilder(
    // params to pipe KValidator variables to validation function
    '_options',
    '_data',
    '_assert'
  )
  
  // validation rules
  let _rules = rules || {}
  // validation function handler
  let _validate = undefined
  // // kill-switch
  // let _run = true
  // data to be tested
  let _data = {}
  // container for available parameters for each test declaration
  let _options = {}
  // tested cache
  _options.tested = {}
  
  // function availabe in test functions
  let _mixins = mixins || {}

  /*
  * mixin: include message in available options
  * inject: _options.parameter to Result.message()
  * returns boolean result to caller test function
  */
  _mixins["message"] = function(result, message) {
    return _result.message(result, message, _options.parameter)
  }

  _init(_rules, _mixins);

// -----------------------------------------------------------------

  function _init(rules, mixins) {
    setRules(rules)
    mix(mixins)
  }


  // additional options for a test function
  function mix(mixins) {
    for(var key in mixins) {
      _options[key] = mixins[key]
    } 
  }


  // define new / override existing assertion function
  function defineTest(slug, fn) {
    _test[slug] = fn
  }


  // change rules
  function setRules (rules) {
    // replace rules
    _rules = rules
    let required;

    for(var key in rules) {
      required = rules[key].match(/required/)
      
      // update value parameter being tested
      _fn.body(`_options.value = _data["${key}"];`)
      
      // update parameter name being tested
      _fn.body(`_options.parameter = "${key}";\n`)
      
      // optimize non-required data
      if(!required)
        _fn.body(`if(_options.value) {`);
      
      // parse rules
      parser(rules[key], (slug, condition) => {
        _fn.body(`_assert("${key}", "${slug}", ${condition});`)
      })

      if(!required) _fn.body('}')
      
      // clean _options.tested after validating each key
      _fn.body('_options.tested = {};\n')
    }
    _compile()
  }


  function _assert(param, rule, condition) {
    // condition for test function
    _options.condition = condition
    // update tested rules for current key
    _options.tested[rule] = _test[rule](_options)
    // log validation result
    _result.add(param, rule, _options.tested[rule])
  }


  // create the validation function
  function _compile() {
    _validate = _fn.build()
  }


  // validate single object
  function validate(data) {
    // change data to be tested
    _data = data
    // console.log(_validate.toString())
    // run compiled validation function
    if(_validate) _validate(_options, _data, _assert)
  }

  function validateArray(arr, onResult, cb) {
    let i = 0
    let n = arr.length
    let timer = setInterval(function() {
      while(i < n) {
        validator.validate(arr[i++])
        onResult({ validator, data:_data })
        validator.next()
      }
      if(i == n) {
        clearInterval(timer)
        if(cb) cb()
      }
    }, 1);
  }

  return {
    validate,
    validateArray,
    setRules,
    mix,
    defineTest,
    errors: _result.errors,
    fail: _result.count,
    invalid: _result.invalid,
    summary: _result.summary,
    next: _result.clear
  }

}


const create = function(rules, mixins) {
  if(!rules) return null
  let _mixins = mixins || {}
  return new KValidator(rules, _mixins);
}


// expose methods
exports.create = create
exports.Validator = KValidator