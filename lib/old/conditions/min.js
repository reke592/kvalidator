const name = 'min'

function test (data, floor, registry) {
  if(registry['string'])
    return data.length >= floor
  else
    return data >= floor
}

module.exports = function(data, option, registry) {
	let result = test(data, option, registry)
	registry[name] = result
	return result
}