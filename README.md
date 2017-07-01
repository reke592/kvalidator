# kvalidator
simple Javascript object validation

```
Example:
  const Validator = require('kvalidator')

  const rules = {
    name: 'string|min:3|max:60|required',
    age: 'number|min:18|required'
  }

  const data = {
    name: 'reke',
    age: 24
  }

  const validator = Validator.create(rules)

  // return: array of error message
  validator.validate(data)
```

# Validator options
```
  validate                    - single object validation
  validateArray               - multiple object validation
  setRules                    - change validator rules
  mix                         - add mixin function
  defineTest                  - define new assertion
  errors: _result.errors      - result errors
  fail: _result.count         - error count
  invalid: _result.invalid    - helper method to check if key value is invalid
  summary: _result.summary    - summary of validation
  next: _result.clear         - clear result, in case you want to use the validator in a loop / interval
```

# Defining new / overriding existing assertions
```
  const Validator = require('kvalidator')
  const validator = Validator.create(rules)

  validator.defineTest('string', function({value, message, tested}) {
    // validate data
    if(tested[some_rule])
      // validation against other rule
    return message(boolean_result, string_message)
  })

  /** Avaliable options in validator.defineTest method
  *     value     - value of parameter being tested
  *     parameter - name of parameter being tested
  *     slug      - rule slug (eg. string, min, max)
  *     option    - rule value (eg. 30 in max:30)
  *     tested    - contains the result of previously tested rules
  *                   Note: the rule sequence in declaration is important when testing against other rules
  *                   eg.
  *                      rules = 'string|min:10|max:20'
  *                        - the rule 'string' can't test angainst other rules
  *                        - the rule 'min' can test against the result of rule 'string' but not the result of rule 'max'
  *                        - the rule 'max' can test against both results of 'string' and 'min'
  *                   
  *     message   - helper function in validator to include error message if boolean_result is false
  */
```

# Adding mixin function to assertions
```
  const Validator = require('kvalidator')
  const rules = {
    name : 'string|required|sample_mixin'
  }
  const validator = Validator.create(rules)

  // create mixin function
  validator.mix({
    'someFunction': function(param) {
      // do something in param
      console.log(param)
    }
  })

  // create a test function and include the mixin in parameter
  validator.defineTest('sample_mixin', function({value, message, someFunction}) {
    // call the mix function
    someFunction(value);
    return message(boolean_result, message)
  });

  let data = {
    name: 'reke'
  }

  validator.validate(data);
```

# Note:
Validator.create() is only a helper
```
  const kvalidator = require('kvalidator')
  const rules = { ... }
  const mixins = {
    'mixA': function(param) {
      // do something ...
    },
    'mixB': function(param) {
      // do something ...
    }
  }

  const validator = new kvalidator.Validator(rules, mixins)
```

# Bulk Validation
Unlike the previous version O(n^2), kvalidator can now test the bulk data much faster.
```
  function onResult({data, validator}) {
    if(validator.fail()) {
      console.log(validator.summary())
    }
    if(validator.invalid('age'))
      results.push(data)
  }

  function done() {
    console.log(results)
    console.log(results.length)
    console.timeEnd('test')
  }

  let data = []
  validator.validateArray(data, onResult, done)
```