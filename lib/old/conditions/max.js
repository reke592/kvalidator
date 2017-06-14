const name = 'max'

function test (data, ceil, registry) {
  if(registry['string'])
    return data.length <= ceil
  else
    return data <= ceil
}

// module.exports = function(data, option, registry) {
// 	let result = test(data, option, registry)
// 	registry[name] = result
// 	return result
// }

function max ({data, rule, registry}) {
	let result = false

  if(registry['string'])
    result = data.length <= ceil
  else
    result = data <= ceil

	registry[name] = result
	return result	
}

/*
	{
		'slug': function(options)
	}
*/

module.exports = {
	max
}