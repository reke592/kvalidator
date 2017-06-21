const KValidator = require('../lib/KValidator')

let data = {
  age: null,
  name: 1,
  message: 'Tinky-winky, Dipsy, Laa-Laa, Po, Po. Tinky-winky, Dipsy, Laa-Laa, Po, Po.',
  address: 'Norzagaray, Bulacan. Philippines'
}

let rules = {
  name: 'string|min:2|max:5|required',
  age: 'number|min:18|max:30|required',
  message: 'string|min:10|max:20|testing',
  address: 'string|min:30|max:255'
}

let bulk = []
let items = 1
for(var i = 0; i <= items; i++)
  bulk.push(data)

let validator = KValidator(rules)
validator.mix({
  somefn: function(data) {
    console.log('mixin call : ' + data)
  }
})

validator.defineTest('testing', function({value, message, somefn}) {
  somefn(value)
  return message(true, 'asd')
})

console.time('test')
for(var j = 0; j < 10; j++)
  validator.validateArray(bulk)
console.timeEnd('test')

console.log('tested data: ' + items)
console.log('errors: ' + validator.fail())
console.log('sample:')
// console.log(validator.errors())

/* TODO:
  optimize lib/Result.js
*/