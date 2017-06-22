const KValidator = require('../lib/KValidator')

let rules = {
  name: 'string|min:2|max:5|required',
  age: 'number|min:18|max:30|required',
  message: 'string|min:10|max:20',
  address: 'string|min:30|max:255'
}

let bulk = []
let items = 10000000
for(var i = 0; i <= items; i++)
  bulk.push({
    age: null,
    name: 1,
    message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    address: 'Norzagaray, Bulacan. Philippines'
  })

let validator = KValidator(rules)
let middle = items / 2
validator.pipe(({index, data}) => {
  if(index == middle) {
    data.checked = true
    console.log('reached 50% in')
    console.timeEnd('pipe')
  }
})

console.time('pipe')
console.time('test')
for(var j = 0; j < 1; j++)
  validator.validateArray(bulk)

console.log('done validation')
console.timeEnd('test')
console.log('tested data: ' + items)
console.log('errors: ' + validator.fail())
console.log('sample:')

bulk = []
// console.log(bulk[middle-1])
// console.log(bulk[middle])
// console.log(bulk[middle+1])

// console.log(validator.errors()[0])

/* TODO:
  optimize lib/Result.js
*/