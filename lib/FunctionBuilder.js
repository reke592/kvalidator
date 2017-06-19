function FunctionBuilder() {
  const before = []
  const events = []
  const after = []
  let _fn_cache = null
  let _stack = null

  function __append(fn, p, r, auto) {
    let parameter = p || ''
    let ret = r || ''
    
    if(ret != '') ret += ' = '
    
    if(auto)
      _stack.push(`${ret}(${fn})(${parameter});`)
    else
      _stack.push(`${ret}${fn}`)
  }

  function first(fn, p, r) {
    _stack = before
    if(fn) __append(fn.toString(), p, r)
    return this
  }

  function then(fn, p, r) {
    _stack = events
    if(fn) __append(fn.toString(), p, r)
    return this
  }

  function last(fn, p, r) {
    _stack = after
    if(fn) __append(fn.toString(), p, r)
    return this
  }

  function auto(fn, p, r) {
    // use currently selected stack, or default to events
    _stack = _stack || events
    if(fn) __append(fn.toString(), p, r, true)
    return this
  }


  function param(typeParam, value) {
    // use currently selected stack, or default to before
    _stack = _stack || before
    __append(JSON.stringify(value) + ';', null, typeParam)
  }

  function force(code) {
    _stack = _stack || before
    __append(code)
  }

  function include(fn) {
    force(`//--- Include function: ${fn.name}\n` + fn.toString())
  }

  function toString() {
    if(_fn_cache) return _fn_cache.toString()
    return before.concat(events, after).join('\n')
  }

  function build(name) {
    _fn_cache = new Function("", toString())
    return _fn_cache
  }

  function run() {
    return (_fn_cache) ? _fn_cache() : undefined
  }

  return {
    include,
    build,
    auto,
    param,
    force,
    first,
    then,
    last,
    run,
    toString
  }
}

module.exports = FunctionBuilder