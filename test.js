const Validator = require('./lib/Validator')

/*
	min:30
*/
const data = {
	age: '30',
	name: ''
}

const val = Validator({
	name: 'string|required',
	age: 'min:30|max:50'
})

let result = val.validate(data)

console.log(result)
