const FunctionBuilder = require('../lib/FunctionBuilder')
const test = require('../lib/test')
const Result = require('../lib/Result')

let result = Result()
let fn = FunctionBuilder()

let data = {
  value: 'reke',
  parameter: 'name'
}

fn.first(fn.include(Result))
fn.first(fn.force('let result = Result()'))
fn.first(fn.param('let data', data))
fn.first(fn.force('data.message = result.message'))
fn.first(fn.force('console.log(data)'))
fn.auto(test['string'], 'data')
fn.build()
// fn.run()

// console.log(fn)
console.log(fn.toString())

/* TODO:
    fix FunctionBuilder
      - create a pipe to communicate outside
*/