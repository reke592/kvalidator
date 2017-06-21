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

#defining new / overriding existing assertions
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

#Adding mixin function to assertions
```
  const rules = {
    name : 'string|required|sample_mixin'
  }
  const validator = Validator(rules)

  validator.mix({
    'someFunction': function(param) {
      // do something in param
      console.log(param)
    }
  })

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

#Bulk Validation
Unlike the previous version O(n^2), kvalidator can now test the bulk data much faster.
```
  // Complexity O(n)
  validator.validateArray(data)
```
Note: As of now I'm currently working for result pipes to avoid Heap error.