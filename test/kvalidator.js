const KValidator = require('../lib/KValidator')

let data = {
  age: '16',
  name: 'reke',
  message: 'Tinky-winky, Dipsy, Laa-Laa, Po, Po. Tinky-winky, Dipsy, Laa-Laa, Po, Po.',
  address: 'Norzagaray, Bulacan. Philippines'
}

let rules = {
  name: 'string|min:2|max:5|required',
  age: 'number|min:18|max:30|required',
  message: 'string|min:10|max:20',
}

let bulk = []
let items = 1000000
for(var i = 0; i < items; i++)
  bulk.push(data)

let validator = KValidator(rules)

console.time('test')
validator.validateArray(bulk)
console.timeEnd('test')

console.log(validator.fail())

/* TODO:
  optimize O(n) to O(n/i)
*/