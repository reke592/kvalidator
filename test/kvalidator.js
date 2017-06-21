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
  message: 'string|min:10|max:20',
  address: 'string|min:30|max:255'
}

let bulk = []
let items = 1000000
for(var i = 0; i <= items; i++)
  bulk.push(data)

let validator = KValidator(rules)

console.time('test')
for(var j = 0; j < 1; j++)
  validator.validateArray(bulk)
console.timeEnd('test')

console.log('tested data: ' + items)
console.log('errors: ' + validator.fail())
console.log('sample:')
console.log(validator.errors()[0])

/* TODO:
  optimize lib/Result.js
*/