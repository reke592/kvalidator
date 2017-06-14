const name = 'required'

function test (data, registry) {
  if(registry['string'])
    return data.length > 0
  //else
  return data != null && data != undefined
}

module.exports = function(data, registry) {
	let result = test(data, registry)
	registry[name] = result
	return result
}