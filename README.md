# kvalidator
simple Javascript object validation

```
Example:
  const rules = {
    name: 'string|min:3|max:60|required',
    age: 'int|min:18|required'
  }

  const data = {
    name: 'reke',
    age: 24
  }

  const validator = Validator(rules)

  // return: array of error message
  validator.test(data)
```