const Validator = require("./lib/KValidator")

module.exports = exports = Validator

// for client browsers
// var KValidator = window.KValidator = Validator

/*
  Example:
  
  const Validator = require('../lib/Kvalidator')

  let data = {
    age: 18,
    name: "reke",
    message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    address: 'Philippines'
  }

  let rules = {
    name: 'string|min:2|max:5|required',
    age: 'number|min:10|max:25|required',
    message: 'string|min:10|max:20',
    address: 'string|min:30|max:255'
  }

  console.log('creating validator..')
  validator = Validator.create(rules)

  validator.validate(data)
  console.log(validator.fail())
  console.log(validator.errors())
  console.log(validator.invalid('message'))
  console.log(validator.summary())
*/