function FunctionBuilder(... param) {
  const before = []
  const events = []
  const after = []
  
  let _params = [].concat(param)
  let _fn_cache = null
  let _stack = null

// -------------------------------------------------

  function __append(fn, p, r, auto) {
    let parameter = p || ''
    let ret = r || ''
    
    if(ret != '') ret += ' = '
    
    if(auto) // prefix ; make sure to close any statement before running
      _stack.push(`;${ret}(${fn})(${parameter});`)
    else
      _stack.push(`${ret}${fn}`)
  }

  function head(fn, p, r, auto) {
    _stack = before
    if(fn) __append(fn.toString(), p, r, auto)
    return this
  }

  function body(fn, p, r, auto) {
    _stack = events
    if(fn) __append(fn.toString(), p, r, auto)
    return this
  }

  function footer(fn, p, r, auto) {
    _stack = after
    if(fn) __append(fn.toString(), p, r, auto)
    return this
  }

  function include(fn) {
    _stack = _stack || before
    __append(`//--- Include function: ${fn.name}\n` + fn.toString())
  }

  function toString() {
    if(_fn_cache) return _fn_cache.toString()
    return before.concat(events, after).join('\n')
  }

  function build() {
    _fn_cache = new Function(_params.join(), toString())
    return _fn_cache
  }

  // function params(... param) {
  //   _params = [].concat(param)
  // }

  return {
    include,
    build,
    // auto,
    // params,
    // force,
    head,
    body,
    footer,
    toString
  }
}

module.exports = FunctionBuilder