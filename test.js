const Validator = require('./lib/Validator')

/*
	min:30
*/
const data = {
	age: '16',
	name: 'reke',
  message: 'Tinky-winky, Dipsy, Laa-Laa, Po, Po. Tinky-winky, Dipsy, Laa-Laa, Po, Po.',
  
  no_rules_for_address: 'Norzagaray, Bulacan. Philippines'
}


const val = Validator({
	name: 'string|min:2|max:5|required',
	age: 'number|min:18|max:30|required',
  message: 'string|min:10|max:20',
  
  useless_rule: 'number|min:5|max:100'
})


let result = val.validate(data)
console.log(result)