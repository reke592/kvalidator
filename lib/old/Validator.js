const assert = require("./Assertions")
const Message = require("./Message")

function Validator (rules) {

  let _separator = '|'
  let _rules = rules
  let _tested = {}
  let message = Message({})

  /** parseRules
  * Split given rules by _separator
  * @param rules string
  * @return array
  *
  * rules format:
  *   'rule:option|rule:option'
  */
  function parseRules (rules) {
    return rules.split(_separator)
  }


  /** separator
  * Change rule separator
  *   @param val String
  *
  * default:
  *   separator = '|'
  *
  * @see parseRules
  */
  function separator (val) {
    _separator = val
  }


  /** _test
  * Test data against given rules,
  * IF fail : push an error message.
  *   @param param_name string
  *   @param data any
  *   @param rules string
  *   @return array : string error message
  *
  * rules format:
  *   'rule:option|rule:option'
  *
  * @see separator
  * @see apply
  */
  function _test (param_name, data, rules) {
    let result = []
    parseRules(rules)
      .forEach((rule) => {
        if(!apply(data, rule)) {
          result.push(message.on(param_name, rule, data, _tested))
        }
      })
    return result
  }


  /** test
  * Run test for each key in data
  * @param data object
  * @return array : summary error message
  * @see _test
  */
  function test (data) {
    let result = []
    for(key in data) {
      result = result.concat(_test(key, data[key], _rules[key]))
    }
    return result
  }


  /** apply
  * Apply assertion
  * @param data any
  * @param rule string
  *
  * rules format:
  *   'rule:option'
  *
  * @see lib/assertions
  */
  function apply (data, rule) {
    return assert(data, rule, _tested)
  }


  // expose methods
  return {
    separator,
    test,
    message
  }

}

module.exports = exports = Validator