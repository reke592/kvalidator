const KValidator = require('../lib/KValidator')

let rules = {
  name: 'string|min:2|max:5|required',
  age: 'number|min:18|max:30|required',
  message: 'string|min:10|max:20',
  address: 'string|min:30|max:255'
}

let bulk = []
let err = []
let items = 1000001

for(var i = 0; i < items; i++)
  bulk.push({
    index: i,
    age: 18,
    name: "reke",
    message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    address: 'Norzagaray, Bulacan. Philippines'
  })

let validator = KValidator(rules)
let middle = items-1
middle = Number.parseInt(middle/2)
validator.pipe(({index, data, valid, message, fail, stop}) => {
  if(fail) {
    err.push({index, message})
  }
})

console.time('test')
validator.validateArray(bulk)
console.log('done validation')
console.timeEnd('test')

console.log('tested data: ' + (bulk.length - 1))
console.log('errors: ' + validator.fail())
console.log('sample:')
console.log(err[216321])
// console.log(bulk)
bulk = []
err = []

// console.log(bulk[middle-1])
// console.log(bulk[middle])
// console.log(bulk[middle+1])

// console.log(validator.errors()[0])

/* TODO:
  optimize lib/Result.js
*/