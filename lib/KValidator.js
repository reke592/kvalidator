/*
* KValidator
* author: erric rapsing
*/

const parser = require('./rule-parser')
const test = require('./test')
const Result = require('./Result')
const FunctionBuilder = require('./FunctionBuilder')

function KValidator(rules, mixins, hooks) {
  const _result = Result(kill_switch)
  const _test = test    // pre-loaded test functions

  // validation function builder
  const _fn = FunctionBuilder(
    // params to pipe KValidator variables to validation function
    '_options',
    '_data',
    '_test',
    '_result',
    '_resetOptions',
    '_hooks'
  )
  
  // validator hooks eg: validator.on('result', cb)
  let _hooks = hooks || {}
  // validation rules
  let _rules = rules || {}
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

  _init(_rules, _mixins, _hooks);

// -----------------------------------------------------------------

  function _init(rules, mixins, hooks) {
    setRules(rules)
    mix(mixins)
    /* on-result hook
     * for each data in array, call hook after validation.
     * @see Result.pipe for options
     */
    if(hooks.result)
      _result.pipe(hooks.result)
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
    /* on-data hook
     * for each data in array, call hook before validation
     */
    if(_hooks['data']) 
      _fn.body(`_hooks['data'](_data);`)
    // replace rules
    _rules = rules
    for(var key in rules) {
      // update value parameter being tested
      _fn.body(`_options.value = _data["${key}"];`)
      // update parameter name being tested
      _fn.body(`_options.parameter = "${key}";\n`)
      // parse rules
      parser(rules[key], (slug, condition) => {
        _fn.body(_addEvent(slug, condition, key, rules[key]))
      })
      // clean _options.tested after validating each key
      _fn.body('_options.tested = {};')
    }
    _compile()
  }


  // private: _addEvent
  // create the script for validation function
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
    // push the result in _result stack, will also run the on-result hook if declared
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
    if(_validate) _validate(_options, _data, _test, _result, _resetOptions, _hooks)
  }


  // validate multiple objects, decrement iteration
  function validateArray(arr) {
    let i = arr.length
    while(--i && _run) {
      validate(arr[i])
    }
    if(_run) validate(arr[0])
    /* on-finish hook
     * run-once after bulk data validation
     */
    if(_hooks.finish) _hooks.finish()
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
    test: _test,
    errors: _result.errors,
    fail: _result.count,
    invalid: _result.invalid,
    summary: _result.summary,
    stop: kill_switch
  }

}


const init = function(rules, mixins, hooks) {
  if(!rules) return null
  let _mixins = mixins || {}
  let _hooks = hooks || {}
  return new KValidator(rules, _mixins, _hooks);
}


// expose methods
exports.Validator = KValidator
exports.init = init