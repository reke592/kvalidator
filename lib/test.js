module.exports = {
	
	'string': function ({data, slug, message}) {
		if(typeof data !== 'string') {
			message.push(`${slug} must be string`)
			return false
		}
		return true
	},

	'min': function ({data, option, tested}) {
		if(tested['string'])
			return data.length >= option
		else
			return data >= option
	},

	'max': function ({data, option, tested}) {
		if(tested['string'])
			return data.length <= option
		else
			return data <= option		
	},

	'required': function ({data, slug, message, tested}) {
		let result = false
		if(tested['string'])
			result = data.length > 0
		else
			result = data != null && data != undefined

		if(result == false) {
			message.push(`${slug} is required!`)
		}

		return result
	}

}