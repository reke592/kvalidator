function Message(options) {

  const dictionary = {
    'string'    : ':param must be string',
    'min'       : ':param is less than :option :remarks',
    'max'       : ':param is greater than :option :remarks',
    'required'  : ':param is required',
    'int'       : ':param must be a number',
    'numeric'   : ':param must contain only numeric characters'
  }  


  function on(param_name, rule, data, tested) {
    let [slug, option] = rule.split(':')
    let message = dictionary[slug]
    let remarks = ''
    let _tested = tested || {}

    if (Object.keys(_tested).find(slug => slug === 'string')) {
      remarks = 'characters'
    }

    message = message.replace(/:param/g, param_name)
    message = message.replace(/:option/g, option)
    message = message.replace(/:remarks/g, remarks)

    return message.trim()    
  }

  function set (slug, message) {
    dictionary[slug] = message
  }

  // expose methods
  return {
    on,
    set
  }

}

module.exports = Message