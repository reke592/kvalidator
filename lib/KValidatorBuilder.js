/*
* KValidator Builder
* author: erric rapsing
*/

const Validator = require('./KValidator')

function KValidatorBuilder() {
  let _rules = undefined
  let _validator = undefined
  const _mixins = {}
  const _hooks = {
    'data' : undefined,
    'result' : undefined,
    'finish' : undefined
  }

  function on(slug, fn) {
    if(_hooks.hasOwnProperty(slug)) {
      console.log(`kvalidator-hooks["${slug}"] : [Function:${fn.name || "Anonymous"}]`)
      _hooks[slug] = fn
    }
    return this
  }

  function mix(slug, fn) {
    if(typeof slug == 'string' && typeof fn == 'function')
      _mixins[slug] = fn
    return this
  }

  function mixins(obj) {
    for(var key in mixins) {
      mix(key, mixins[key]);
    }
  }

  function create(rules) {
    _rules = rules
    return Validator.init(_rules, _mixins, _hooks)
  }

  return {
    on,
    mix,
    mixins,
    create
  }
}


module.exports = exports = new KValidatorBuilder()