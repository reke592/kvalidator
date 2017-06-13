const Validator = require("./lib/Validator")
module.exports = Validator

/*
  Example:

  const rules = {
    name: 'string|max:30|min:3|required',
    age: 'int|min:18|max:99|required'
  }

  const data = {
    name: 'asa',
    age: 18
  }

  const validator = Validator(rules)

  // return: array of error message
  validator.test(data)
*/