function parse(param_name, param_rules, param_data, cb) {
  if(!param_rules) return true
	let rules = param_rules.match(/[a-zA-Z0-9]+\:{0,1}([a-zA-Z0-9]+)/g);
	rules.forEach(rule => {
		cb(param_name, rule, param_data)
	})
}

module.exports = parse
