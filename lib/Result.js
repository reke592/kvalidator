/*
* KValidator Result
* author: erric rapsing
*/

function Result() {
  let _pipe = undefined     // use heap by default

  // let _current_parameter = null
  let _result = {}
  let _errors = {}
  let _summary = true
  let _count = 0

  function message(result, message, parameter) {
    parameter = parameter || _count
    if(!_errors[parameter])
      _errors[parameter] = []
    if(result == false) {
      _errors[parameter].push(message)
      _count ++
    }

    _summary = _summary && result;
    // return back the result to test function being called
    return result
  }

  function errors(key) {
    if(key) return _errors[key]
    // else
    let clone = {}
    for(var key in _errors) {
      clone[key] = _errors[key]
    }
    return clone
  }

  // summary
  function add(parameter, slug, result) {
    // check if not yet tested
    if(_result[parameter] === undefined) {
      // assume true
      _result[parameter] = true
    }
    // sum of validation results for each key
    _result[parameter] = _result[parameter] && result
  }

  // clear results for next validation
  function clear() {
    // reset current state for next data
    _result = {}
    _errors = {}
    _summary = true
  }

  // returns array of validation message
  // function errors() {
  //   return _errors
  // }

  // returns array of validation summary
  function summary() {
    return _result
  }

  // check if key/parameter is invalid based on rules
  function invalid(parameter) {
    return !_result[parameter]
  }

  // count of errors
  function count() {
    return _count
  }

  return {
    add,
    count,
    errors,
    invalid,
    message,
    clear,
    summary
  }

}

module.exports = Result