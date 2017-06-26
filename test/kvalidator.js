const ValidatorBuilder = require('../lib/KValidatorBuilder')

let rules = {
  name: 'string|min:2|max:5|required',
  age: 'number|min:18|max:30|required',
  message: 'string|min:10|max:20',
  address: 'string|min:30|max:255'
}

// ValidatorBuilder.on('data', function(data) {
//   // data.message = data.message.substr(0, 20);
// })

// ValidatorBuilder.on('result', function({index, data, valid, message, fail, stop}) {
//   err.push(message);
//   if(index == 50)
//     stop()
// })

// ValidatorBuilder.on('finish', () => {
//   console.timeEnd('test')
//   console.log('done')
//   console.log('sample data: ' + (bulk.length - 1))
//   console.log('errors: ' + validator.fail())
//   console.log('sample:')
//   console.log(err[50])
//   bulk = []
//   err = []
// })


let bulk = []
let err = []
let items = 1000001
let singleData = {
  age: 18,
  name: "reke",
  message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  address: 'Norzagaray, Bulacan. Philippines'
}


for(var i = 0; i < items; i++)
  bulk.push({
    age: 18,
    name: "reke",
    message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    address: 'Norzagaray, Bulacan. Philippines'
  })

console.time('test')
let validator = ValidatorBuilder.create(rules);
// validator.validateArray(bulk)

validator.validate(singleData)
if(validator.fail())
  console.log(validator.errors())

/* TODO:
  optimize lib/Result.js
*/