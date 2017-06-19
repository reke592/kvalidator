const KValidator = require("./lib/KValidator")
module.exports = KValidator

/*
  Example:

  const rules = {
    name: 'string|max:30|min:3|required',
    age: 'int|min:18|max:99|required'
  }

  const data = {
    name: 'reke',
    age: 18
  }

  const validator = Validator(rules)

  // return: array of error message
  validator.validate(data)
*/