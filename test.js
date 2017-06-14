const Validator = require('./lib/Validator')

/*
	min:30
*/
const data = {
	age: '20',
	name: 'reke'
}

const val = Validator({
	name: 'string|min:2|max:5|required',
	age: 'number|min:18|max:30|required'
})

let result = val.validate(data)

console.log(result)
