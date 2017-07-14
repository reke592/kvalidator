module.exports = {
	
	'string': ({value, parameter, message}) => {
		let result = false
		result = typeof value === 'string'
		return message(result, `${parameter} must be string`)
	},


	'number': function ({value, parameter, message}) {
		let result = false
		result = !!Number(value)
		return message(result, `${parameter} must be a number`)
	},


	'min': function ({value, parameter, condition, message, tested}) {
		let result = false
		let remarks = ''
		let floor = Number(condition)
		if(!floor) throw new Error(`invalid value given in rule "${parameter}:${condition}"`)
		if(typeof value == 'string') {
			result = value.length >= floor
			remarks = 'characters'
		}
		else {
			result = value >= floor
		}
		return message(result, `${parameter} is less than ${condition} ${remarks}`.trim())
	},


	'max': function ({value, parameter, condition, message, tested}) {
		let result = false
		let remarks = ''
		let ceil = Number(condition)
		if(!ceil) throw new Error(`invalid value given in rule "${parameter}:${condition}"`)
		if(typeof value == 'string') {
			result = value.length <= ceil
			remarks = 'characters'
		}
		else {
			result = value <= ceil	
		}
		return message(result, `${parameter} is greater than ${condition} ${remarks}`.trim())
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