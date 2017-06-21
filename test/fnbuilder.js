const FunctionBuilder = require('../lib/FunctionBuilder')
const test = require('../lib/test')
const Result = require('../lib/Result')

let result = Result()
let fn = FunctionBuilder('_data', '_result')

let data = {
  value: 1,
  parameter: 'name'
}

// fn.params('_data','_result')
let x = fn.head('var data = _data')
          .head('data.message = _result.message')
          .body(test['string'], 'data', null, true)
          .footer('_result.log()')
          .build()

x(data, result)
console.log(result.errors())

/* TODO:
    fix FunctionBuilder
      - create a pipe to communicate outside
*/