function parse(param, cb) {
  if(!param) return true
  let rules = param.match(/[a-zA-Z0-9]+\:{0,1}([\"a-zA-Z0-9]+)/g);

  rules.forEach(rule => {
    let [slug, condition] = rule.split(':')
    cb(slug, condition)
 })
}

module.exports = parse
