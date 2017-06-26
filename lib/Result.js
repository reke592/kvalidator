function Result(stop) {
  const _kill_switch = stop

  let _pipe = undefined     // use heap by default

  let _current_parameter = null
  let _current_result = {}
  let _current_errors = {}
  let _current_summary = true
  let _current_index = 0
  
  // when using Heap in validation
  let _count = 0
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
    for(var key in _current_errors) {
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


  // after each validation
  function log(data) {
    // use pipe
    if(_pipe) {
      _pipe ({
        data,
        fail: !_current_summary,
        message: (!_current_summary) ? _current_errors : null,
        index: _current_index,
        stop: _stop,
        valid: _current_result
      })
    }
    // use heap
    else {
      _summary_results.push(_current_result)
      _summary_messages.push(_current_errors)  
    }
    // reset current state for next data
    next()
  }

  // forced stop
  function _stop() {
    // since log() is being called after each validation, we need to exclude the last result
    _summary_results.pop()
    _summary_messages.pop()
    _count --
    _kill_switch(_current_index)
  }


  // next index
  function next() {
    // reset current state for next data
    _current_result = {}
    _current_errors = {}
    _current_summary = true
    _current_index ++
  }

  
  // after each validation call _pipe
  function pipe(fn) {
    _pipe = fn
  }

  // returns array of validation message
  function errors() {
    if(_summary_messages.length > 1)
      return [].concat(_summary_messages)

    return _summary_messages[0]
  }

  // returns array of validation summary
  function summary() {
    if(_summary_results.length > 1)
      return [].concat(_summary_results)

    return _summary_results[0]
  }

  // check if parameter is invalid
  function invalid(parameter, index) {
    let i = index || 0
    return (_summary_results[i]) ? !_summary_results[i][parameter] : undefined
  }

  // count of errors
  function count() {
    return _count
  }

  function getIndex() {
    return _current_index
  }

  return {
    add,
    count,
    errors,
    getIndex,
    invalid,
    log,
    message,
    next,
    pipe,
    summary
  }

}

module.exports = Result