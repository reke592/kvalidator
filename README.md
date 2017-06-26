# kvalidator
simple Javascript object validation

```
Example:
  const rules = {
    name: 'string|min:3|max:60|required',
    age: 'number|min:18|required'
  }

  const data = {
    name: 'reke',
    age: 24
  }

  const validator = Validator(rules)

  // return: array of error message
  validator.validate(data)
```

#Creating a validator using the Builder
```
  const KValidator = require("kvalidator")

  const rules = {
    name: 'string|min:15|max:30',
    age: 'min:18|max:99'
  }

  var builder = KValidator.Builder

  // on-data : before each validation hook
  builder.on('data', function(data) {
    console.log(data);
    // some data mutations before validation
  })

  // on-result : after each validation hook
  builder.on('result', function({message}) {
    console.log(message)
    // logic when data is valid/invalid (eg. push to an array stack if invalid, etc.)
  })

  // on-finish : after all validation test hook (for improvement : MUST emit something when running on a child-process)
  builder.on('finish', () => console.log('done'))

  // create the validation function
  var validator = builder.create(rules)

  // test data
  var items = [
    {
      name: 'Ann Lyn',
      age: 24
    },
    {
      name: 'Max Col',
      age: 25
    }
  ]

  validator.validateArray(items)
```

#Defining new / overriding existing assertions
```
  const validator = Validator(rules)

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

#Adding mixin function to assertions direct in KValidator.Validator
```
  const Validator = require('kvalidator').Validator
  const rules = {
    name : 'string|required|sample_mixin'
  }
  const validator = Validator(rules)

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

Note: You can also define a mixin function via Builder
```
  const builder = require('kvalidator').Builder
  const rules = { ... }

  // declare hooks
  builder.on('data', fn)
  builder.on('result', fn)
  builder.on('finish', fn)

  // include mixins
  builder.mix('slug', fn)
  builder.mixins({
    'slug': fn
  })

  // create the validator
  const validator = builder.create(rules)

  // define a new test and use the mixin_slug
  validator.defineTest('slug', ({ mixin_slug }) => mixin())
```

#Bulk Validation
Unlike the previous version O(n^2), kvalidator can now test the bulk data much faster.
```
  validator.validateArray(data)
```