const Validator = require("./lib/KValidator")
const Builder = require("./lib/KValidatorBuilder")

exports.Validator = Validator
exports.Builder = Builder

// for client browsers
var KValidator = window.KValidator = exports

/*
  Example:
  
  const KValidator = require("kvalidator")
  const rules = {
    name: 'string|max:30|min:3|required',
    age: 'int|min:18|max:99|required'
  }

  const data = {
    name: 'reke',
    age: 18
  }

  let builder = KValidator.Builder
  builder.on('data', function(data) {
    // run statement, before each validation
    // eg. data-mutation before validation
  })

  builder.on('result', function({
        data,
        fail,         // true if violated any rule
        message,      // violation message
        index,        // array index
        stop,         // kill-switch to force-stop the validation process
        valid         // current validation result (eg. valid.name, valid.age)
      }))

  const validator = builder.create(rules)

  // return: array of error message
  validator.validate(data)
*/