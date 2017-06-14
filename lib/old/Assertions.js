const test_string = require('./conditions/string')
const test_min = require('./conditions/min')
const test_max = require('./conditions/max')
const test_required = require('./conditions/required')

function Assertions(data, rule, done) {
  let [slug, option] = rule.split(':')

  switch(slug) {
    case 'string':
      return test_string(data, done)
    case 'min':
      return test_min(data, option, done)
    case 'max':
      return test_max(data, option, done)
    case 'number':
      return test_number(data)
    case 'numeric':
      return test_numeric(data)
    case 'required':
      return test_required(data, done)
    default:
      console.log(`unknown rule: ${slug}`)
      break;
  }
}

function test_number (data) {
  return typeof data === 'number'
}

function test_numeric (data) {
  if(typeof data === 'string') {
    // only match numerical characters
    return !data.match(/[^(0-9\,\.)]+/)
  }
  else {
    return test_number(data)
  }
}

module.exports = Assertions
