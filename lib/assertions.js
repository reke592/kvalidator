function Assertions(data, rule) {
  let [slug, option] = rule.split(':')
  
  switch(slug) {
    case 'string':
      return test_string(data)
    case 'min':
      return test_min(data, option)
    case 'max':
      return test_max(data, option)
    case 'number':
    case 'int':
      return test_number(data)
    case 'required':
      return test_required(data)
    default:
      console.log(`unknown rule: ${slug}`)
      break;
  }
}

function test_string (data) {
  return typeof data === 'string'
}

function test_number (data) {
  return typeof data === 'number'
}

function test_max (data, ceil) {
  if(test_string(data))
    return data.length <= ceil
  else
    return data <= ceil
}

function test_min (data, floor) {
  if(test_string(data))
    return data.length >= floor
  else
    return data >= floor
}

function test_required (data) {
  if(test_string(data))
    return data.length > 0
  //else
  return data != null && data != undefined
}

module.exports = Assertions
