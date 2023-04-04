const { body, validationResult } = require('express-validator')
const {
  returnError,
  returnValidationErrorsAsJSON
} = require('../utils/generateError')

const validateSignUp = [
  body('login').notEmpty().withMessage('Login não pode ser vazio!'),
  body('password').notEmpty().withMessage('Senha não pode ser vazio!'),
  body('name').notEmpty().withMessage('Nome não pode ser vazio!')
]
const validateSignIn = [
  body('login').notEmpty().withMessage('Login não pode ser vazio!'),
  body('password').notEmpty().withMessage('Senha não pode ser vazio!')
]

const validateCategory = [
  body('name').notEmpty().withMessage('Nome da categoria não pode ser vazio!'),
  body('description').notEmpty().withMessage('Descrição da categoria não pode ser vazio!')
]

const validateSection = [
  body('name').notEmpty().withMessage('Nome do departamento não pode ser vazio!'),
  body('description').notEmpty().withMessage('Descrição do departamento não pode ser vazio!')
]

const catchError = (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      returnValidationErrorsAsJSON(errors, res)
    } else {
      next()
    }
  } catch (error) {
    returnError(error, res)
  }
}

module.exports = {
  validateSignUp,
  validateSignIn,
  validateSection,
  validateCategory,
  catchError
}
