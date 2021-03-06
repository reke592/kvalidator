/*
* FunctionBuilder
* author: erric rapsing
*/

function FunctionBuilder(... param) {
  let _before = []
  let _events = []
  let _after = []
  
  let _params = [].concat(param)
  let _fn_cache = null
  let _stack = undefined

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
    _stack = _before
    if(fn) __append(fn.toString(), p, r, auto)
    return this
  }

  function body(fn, p, r, auto) {
    _stack = _events
    if(fn) __append(fn.toString(), p, r, auto)
    return this
  }

  function footer(fn, p, r, auto) {
    _stack = _after
    if(fn) __append(fn.toString(), p, r, auto)
    return this
  }

  function include(fn) {
    _stack = _stack || _before
    __append(`//--- Include function: ${fn.name}\n` + fn.toString())
  }

  function toString() {
    if(_fn_cache) return _fn_cache.toString()
    return _before.concat(_events, _after).join('\n')
  }

  function build() {
    // console.log(toString())
    _fn_cache = new Function(_params.join(), toString())
    _reset()
    return _fn_cache
  }

  function _reset() {
    _before = []
    _events = []
    _after = []
    _params = []
    _stack = undefined
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