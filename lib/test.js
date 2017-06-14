module.exports = {
	
	'string': function ({value, parameter, message}) {
		let result = false
		result = typeof value === 'string'
		return message(result, `${parameter} must be string`)
	},


	'number': function ({value, parameter, message}) {
		let result = false
		result = !!Number(value)
		return message(result, `${parameter} must be a number`)
	},


	'min': function ({value, parameter, slug, option, message, tested}) {
		let result = false
		let remarks = ''
		let floor = Number(option)
		if(!floor) throw new Error(`invalid value given in rule "${slug}:${option}"`)
		if(tested['string']) {
			result = value.length >= floor
			remarks = 'characters'
		}
		else {
			result = value >= floor
		}
		return message(result, `${parameter} is less than ${option} ${remarks}`.trim())
	},


	'max': function ({value, parameter, slug, option, message, tested}) {
		let result = false
		let remarks = ''
		let ceil = Number(option)
		if(!ceil) throw new Error(`invalid value given in rule "${slug}:${option}"`)
		if(tested['string']) {
			result = value.length <= option
			remarks = 'characters'
		}
		else {
			result = value <= ceil	
		}
		return message(result, `${parameter} is greater than ${option} ${remarks}`.trim())
	},


	'required': function ({value, parameter, message, tested}) {
		let result = false
		if(tested['string']) {
			result = value.length > 0
		}
		else {
			result = value != null && value != undefined
		}
		return message(result, `${parameter} is required!`)
	}

}