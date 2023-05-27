const config = require('../config/auth.config')
const User = require('../models/user')
const TokenEfemero = require('../models/tokenEfemero')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {
  genareteError,
  returnError
} = require('../utils/generateError')

const signUp = async (req, res) => {
  try {
    const usuarioEncontrado = await User.findOne({
      where: {
        login: req.body.login
      }
    })
    if (usuarioEncontrado) {
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

    const userObject = {}

    if (req.body.email) {
      userObject.email = req.body.email
    }

    userObject.login = req.body.login
    userObject.name = req.body.name
    userObject.password = bcrypt.hashSync(req.body.password, 8)

    const user = await User.create(userObject)

    await user.addRole([1])
    return res.status(200).send('Usuário criado com sucesso!')
  } catch (error) {
    returnError(error, res)
  }
}

const signIn = async (req, res) => {
  try {
    const usuarioEncontrado = await User.findOne({
      where: {
        login: req.body.login
      }
    })

    if (!usuarioEncontrado) {
      genareteError('Usuário não encontrado!', 404)
    }

    const checarSenha = bcrypt.compareSync(
      req.body.password,
      usuarioEncontrado.password
    )

    if (!checarSenha) {
      genareteError('Senha incorreta', 401)
    }

    const token = jwt.sign({
      id: usuarioEncontrado.id
    }, config.chaveSecreta, {
      expiresIn: config.jwtValidate
    })

    const tokenEfemero = await TokenEfemero.criarToken(usuarioEncontrado)

    let accessRoles = []
    const userRoles = await usuarioEncontrado.getRole()

    accessRoles = userRoles.map(e => {
      return e.name
    })

    return res.status(200).send({
      id: usuarioEncontrado.id,
      login: usuarioEncontrado.login,
      acessos: accessRoles,
      nome: usuarioEncontrado.name,
      token,
      tokenEfemero
    })
  } catch (error) {
    returnError(error, res)
  }
}

const tokenQueExpira = async (req, res) => {
  try {
    const { tokenRequisicao } = req.body
    if (!tokenRequisicao) {
      genareteError('Token não encontrado!', 403)
    }

    const tokenEfemero = await TokenEfemero.findOne({ where: { token: tokenRequisicao } })

    if (!tokenEfemero) genareteError('A chave de geração de um novo token não está cadastrada no sistema!', 403)

    if (TokenEfemero.validar(tokenEfemero)) {
      await TokenEfemero.destroy({ where: { id: tokenEfemero.id } })
      genareteError('Faça login novamente!', 403)
    }

    const usuario = await tokenEfemero.getUser()
    const userRoles = await usuario.getRole()
    const accessRoles = userRoles.map(e => {
      return e.name
    })

    const novoToken = jwt.sign({
      id: usuario.id
    }, config.chaveSecreta, {
      expiresIn: config.jwtValidate
    })

    return res.status(200).send({
      acessos: accessRoles,
      id: usuario.id,
      login: usuario.login,
      nome: usuario.name,
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
