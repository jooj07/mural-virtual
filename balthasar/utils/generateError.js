
const genareteError = (message, code) => {
  const err = new Error('')
  err.msg = message
  err.code = code
  throw err
}

const returnError = (err, res) => {
  console.error(err)
  if (err && err.code) {
    res.status(err.code).send(err.msg)
  } else {
    res.status(500).send('Houve um erro')
  }
}

const returnValidationErrorsAsJSON = (err, res) => {
  console.error(err)
  return res.status(422).json({ errors: err.array() })
}

module.exports = {
  genareteError,
  returnError,
  returnValidationErrorsAsJSON
}
