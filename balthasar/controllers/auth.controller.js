const config = require('../config/auth.config')
const database = require('../db')
const Question = require('../models/question')
const Role = require('../models/role')
const User = require('../models/user')
const TokenEfemero = require("../models/tokenEfemero")

const db = database
const Op = db.Sequelize.Op

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const {
  genareteError,
  returnError
} = require('../utils/generateError')



const signUp = async (req, res) => {
  try {
    const userFound = await User.findOne({
      where: {
        login: req.body.login
      }
    })
    if (userFound) {
      genareteError('Usuário Já cadastrado com este login!', 404)
    }
    // email
    if (req.body.email) {
      const userFoundByEmail = await User.findOne({
        where: {
          email: req.body.email
        }
      })
      if (userFoundByEmail) {
        genareteError('Usuário Já cadastrado com este email!', 404)
      }
    }
    // phone
    if (req.body.phone) {
      const userFoundByPhone = await User.findOne({
        where: {
          phone: req.body.phone
        }
      })
      if (userFoundByPhone) {
        genareteError('Usuário já encontrado com este telefone!', 404)
      }
    }
    // validar aq
    // let err = new Error('')
    // err.msg = 'Usuário Já cadastrado com este login!'
    // err.code = 404
    // throw err
    const userObject = {}

    if (req.body.phone) {
      userObject.phone = req.body.phone
    }

    if (req.body.email) {
      userObject.email = req.body.email
    }

    userObject.login = req.body.login
    userObject.name = req.body.name
    userObject.password = bcrypt.hashSync(req.body.password, 8)

    const user = await User.create(userObject)

    if (req.body.question) {
      // TODO: futuramente validação de telefone
      if (!req.body.answer) {
        genareteError('Se você quer definir uma pergunta de segurança, antes defina uma resposta.', 404)
      }

      const securityQuestion = await Question.create({
        question: req.body.question,
        answer: req.body.answer
      })

      await user.setQuestions(securityQuestion.id)
      // await user.setQuestion(securityQuestion.id)
    }
    await user.addRole([1])
    return res.status(200).send('Usuário criado com sucesso!')
  } catch (error) {
    returnError(error, res)
  }
}

const signIn = async (req, res) => {
  try {
    const userFound = await User.findOne({
      where: {
        login: req.body.login
      }
    })

    if (!userFound) {
      genareteError('Usuário não encontrado!', 404)
    }

    const checkThePassword = bcrypt.compareSync(
      req.body.password,
      userFound.password
    )

    if (!checkThePassword) {
      genareteError('Senha incorreta', 401)
    }

    const token = jwt.sign({
      id: userFound.id
    }, config.secret, {
      expiresIn: config.jwtValidate
    })

    const tokenEfemero = await TokenEfemero.criarToken(userFound)

    let accessRoles = []
    const userRoles = await userFound.getRole()

    accessRoles = userRoles.map(e => {
      return e.name
    })

    return res.status(200).send({
      id: userFound.id,
      login: userFound.login,
      acessos: accessRoles,
      token,
      tokenEfemero
    })
  } catch (error) {
    returnError(error, res)
  }
}

const tokenQueExpira = async (req, res) => {
  try {
    const { tokenRequisicao } = req.body;
    if (!tokenRequisicao) {
      genareteError('Token não encontrado!', 403)
    }

    let tokenEfemero = await TokenEfemero.findOne({ where: { token: tokenRequisicao } })

    if (!tokenEfemero) genareteError('A chave de geração de um novo token não está cadastrada no sistema!', 403)

    if (TokenEfemero.validar(tokenEfemero)) {
      await TokenEfemero.destroy({ where: { id: tokenEfemero.id } })
      genareteError('Faça login novamente!', 403)
    }

    const usuario = await tokenEfemero.getUser()

    let novoToken = jwt.sign({
      id: usuario.id
    }, config.secret, {
      expiresIn: config.jwtValidate
    })

    return res.status(200).send({
      token: novoToken,
      tokenEfemero: tokenEfemero.token
    })
  } catch (error) {
    returnError(error, res)
  }
}

module.exports = {
  signUp,
  signIn,
  tokenQueExpira
}
