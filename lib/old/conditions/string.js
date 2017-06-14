const name = 'string'

function test(data) {
	return typeof data === 'string'
}

module.exports = function(data, registry) {
	let result = test(data)
	registry[name] = result
	return result
}