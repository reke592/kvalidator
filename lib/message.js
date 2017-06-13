const dictionary = {
  'string'    : ':param must be string',
  'min'       : ':param is less than :option :remarks',
  'max'       : ':param is greater than :option :remarks',
  'required'  : ':param is required',
  'int'       : ':param must be a number'
}

function Message (param_name, rule, data) {
  let [slug, option] = rule.split(':')
  let message = dictionary[slug]
  let remarks = ''

  if (typeof data === 'string') {
    remarks = 'characters'
  }

  message = message.replace(/:param/g, param_name)
  message = message.replace(/:option/g, option)
  message = message.replace(/:remarks/g, remarks)

  return message.trim()
}

module.exports = Message