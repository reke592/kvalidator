const Validator = require('../lib/KValidator')
const rules = {
  name : 'string|required|sample-mixin'
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
validator.defineTest('sample-mixin', function({value, message, someFunction}) {
  // call the mix function
  someFunction(value);
  // return message(boolean_result, message)
  return message(false, 'testing')
});

let data = {
  name: 'reke'
}

validator.validate(data);