const parser = require('./rule-parser')
const test = require('./test')
const Result = require('./Result')
const FunctionBuilder = require('./FunctionBuilder')

function KValidator(rules, mixins) {
  const _result = Result(kill_switch)
  const _test = test    // pre-loaded test functions
  
  // validation function builder
  const _fn = FunctionBuilder(
    // params to pipe KValidator variables to validation function
    '_options',
    '_data',
    '_test',
    '_result',
    '_resetOptions'
  )
  
  // validation rules
  let _rules = rules
  // list of events for validation function
  let _events = []
  // validation function handler
  let _validate = undefined
  // kill-switch
  let _run = true
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
    for(key in mixins) {
      _options[key] = mixins[key]
    } 
  }


  // define new / override existing assertion function
  function defineTest(slug, fn) {
    _test[slug] = fn
  }


  // change rules
  function setRules (rules) {
    // reset events
    _events = []
    // replace rules
    _rules = rules
    for(key in rules) {
      _fn.body(`_options.value = _data["${key}"];`)
      // update parameter being tested
      _fn.body(`_options.parameter = "${key}";\n`)
      parser(rules[key], (slug, condition) => {
        _fn.body(_addEvent(slug, condition, key, rules[key]))
      })
      // clean _options.tested after validating each key
      _fn.body('_options.tested = {};')
    }
    _compile()
  }


  // private: _addEvent
  // to write the source for validation function
  function _addEvent(slug, condition, parameter, rules) {
    // let token = `if(this._rules["${parameter}"].match(/${slug}/)) {\n`
      let required = rules.match(/required/)
      let token = ''

      // optimize validation for non-required parameters
      if(!required) token += `if(_options.value) {\n`
        // update condition
        token += `_options.condition = ${condition};\n`
        // include test function result in tested
        token += `_options.tested["${slug}"] = _test["${slug}"](_options);\n`
        // create a result summary for tested parameter
        token += `_result.add("${parameter}","${slug}", _options.tested["${slug}"]);\n`
        // clean _options [value, parameter, condition]
        token += `_resetOptions();\n`
      if(!required) token += `}`

    return token
  }


  // create the validation function
  function _compile() {
    // push the result in _result stack
    _fn.footer('_result.log(_data);')
    _validate = _fn.build()
  }


  // after each test reset needed options
  function _resetOptions() {
    _options.condition = undefined
  }


  // validate single object
  function validate(data) {
    // change data to be tested
    _data = data
    // run compiled validation function
    if(_validate) _validate(_options, _data, _test, _result, _resetOptions)
  }


  // validate multiple objects
  function validateArray(arr) {
    let i = arr.length
    while(--i && _run) {
      validate(arr[i])
    }
    if(_run) validate(arr[0])
  }


  function kill_switch(index) {
    console.log(`Validation kill-switch has been triggered. [index: ${index}]`)
    _run = false
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
    pipe: _result.pipe,
    stop: kill_switch
  }

}

module.exports = KValidator