function Result(validator) {
  let _pipe = undefined
  let _count = 0

  let _validator = validator

  let _current_parameter = null
  let _current_result = {}
  let _current_errors = {}
  let _current_summary = true
  let _current_index = 0
  
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

    _current_summary = _current_summary && result;
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
  function log(data) {
    // use pipe
    if(_pipe) {
      _pipe ({
        fail: _current_summary,
        message: _current_errors,
        valid: _current_result,
        index: _current_index,
        data
      })
    }
    // use heap
    else {
      _summary_results.push(_current_result)
      _summary_messages.push(_current_errors)  
    }
    // reset current state for next data
    _current_result = {}
    _current_errors = {}
    _current_summary = true
    _current_index ++
  }


  function pipe(fn) {
    if(_pipe) throw new Error(`validator pipe is already in used by a function <${_pipe.name || "Anonymous"}>`)
    _pipe = fn
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
    summary,
    invalid,
    count,
    pipe
  }

}

module.exports = Result