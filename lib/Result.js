function Result(validator) {

  let _count = 0
  let _validator = validator

  let _current_parameter = null
  let _current_result = {}
  let _current_errors = {}
  let _summary_results = []
  let _summary_messages = []

  function message(result, message, parameter) {
    parameter = parameter || _count
    if(!_current_errors[parameter])
      _current_errors[parameter] = []
    if(result == false) {
      _current_errors[parameter].push(message)
      _count ++
    }
    // return back the result to test function being called
    return result
  }

  function errors() {
    let clone = {}
    for(key in _current_errors) {
      clone[key] = _current_errors[key]
    }
    return clone
  }

  // summary
  function add(parameter, slug, result) {
    // check if not yet tested
    if(_current_result[parameter] === undefined) {
      // assume true
      _current_result[parameter] = true
    }
    _current_result[parameter] = _current_result[parameter] && result
  }


  // commit summary
  function log() {
    _summary_results.push(_current_result)
    _summary_messages.push(_current_errors)
    _current_result = {}
    _current_errors = {}
  }


  function errors() {
    if(_summary_messages.length > 1)
      return [].concat(_summary_messages)

    return _summary_messages[0]
  }

  function summary() {
    if(_summary_results.length > 1)
      return [].concat(_summary_results)

    return _summary_results[0]
  }

  function invalid(parameter, index) {
    let i = index || 0
    return (_summary_results[i]) ? !_summary_results[i][parameter] : undefined
  }

  function count() {
    return _count
  }

  return {
    log,
    errors,
    message,
    add,
    errors,
    summary,
    invalid,
    count
  }

}

module.exports = Result