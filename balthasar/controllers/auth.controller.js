const config = require('../config/auth.config')
const database = require('../db')
const Question = require('../models/question')
const Role = require('../models/role')
const User = require('../models/user')

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
    console.log('--------------------------------')
    console.log('passei aq')
    console.log('--------------------------------')
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
    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles
          }
        }
      })
      user.setRole(roles).then(() => {
        res.send({
          message: 'User registered successfully!'
        })
      })
    } else {
      user.setRole([1]).then(() => {
        return res.status(200).send({
          message: 'Usuário registrado com sucesso!'
        })
      })
    }
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
      expiresIn: 86400 // 24 hours
    })

    let accessRoles = []
    const userRoles = await userFound.getRole()

    accessRoles = userRoles.map(e => {
      return e.name
    })
    const hasQuestion = await userFound.getQuestion()
    return res.status(200).send({
      id: userFound.id,
      login: userFound.login,
      phone: userFound.phone,
      email: userFound.email,
      roles: accessRoles,
      recoveryPasswordThroughTelegram: !!(hasQuestion && hasQuestion.length),
      accessToken: token
    })
  } catch (error) {
    returnError(error, res)
  }
}

module.exports = {
  signUp,
  signIn
}
