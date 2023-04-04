const config = require('../config/auth.config')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const checkToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]

    if (!token) {
      const err = new Error('')
      err.msg = 'Você não está logado!'
      err.code = 401
      throw err
    }

    jwt.verify(token, config.chaveSecreta, (err, decoded) => {
      if (err) {
        const err = new Error('')
        err.msg = 'Sem token informado!'
        err.code = 401
        throw err
      }
      req.userId = decoded.id
      next()
    })
  } catch (error) {
    console.error(error)
    if (error && error.code) {
      res.status(error.code).send(error.msg)
    } else {
      res.status(500).send('Houve um erro')
    }
  }
}

const checkAdm = async (req, res, next) => {
  try {
    const userFound = await User.findByPk(req.userId)

    if (!userFound) {
      const err = new Error('')
      err.msg = 'Usuário não encontrado'
      err.code = 500
      throw err
    }

    const userRoles = await userFound.getRole()

    if (!userRoles) {
      const err = new Error('')
      err.msg = 'Usuário sem tipo de cadastro!'
      err.code = 500
      throw err
    }

    const hasAccess = userRoles.find(element => {
      if (element.name.includes('administrador')) {
        return true
      } else {
        return false
      }
    })
    if (hasAccess) {
      next()
    } else {
      const err = new Error('')
      err.msg = 'Esse acesso requer acesso de Administrador!'
      err.code = 403
      throw err
    }
  } catch (error) {
    console.error(error)
    if (error && error.code) {
      res.status(error.code).send(error.msg)
    } else {
      res.status(500).send('Houve um erro')
    }
  }
}

const checkUser = async (req, res, next) => {
  try {
    const userFound = await User.findByPk(req.userId)

    if (!userFound) {
      const err = new Error('')
      err.msg = 'Usuário não encontrado'
      err.code = 500
      throw err
    }

    const userRoles = await userFound.getRole()

    if (!userRoles) {
      const err = new Error('')
      err.msg = 'Usuário sem tipo de cadastro!'
      err.code = 500
      throw err
    }

    const hasAccess = userRoles.find(element => {
      if (element.name.includes('servidor')) {
        return true
      } else {
        return false
      }
    })
    if (hasAccess) {
      next()
    } else {
      const err = new Error('')
      err.msg = 'Esse acesso requer acesso de Servidor!'
      err.code = 403
      throw err
    }
  } catch (error) {
    console.error(error)
    if (error && error.code) {
      res.status(error.code).send(error.msg)
    } else {
      res.status(500).send('Houve um erro')
    }
  }
}

const checkUserAndAdmin = async (req, res, next) => {
  try {
    const userFound = await User.findByPk(req.userId)

    if (!userFound) {
      const err = new Error('')
      err.msg = 'Usuário não encontrado'
      err.code = 500
      throw err
    }

    const userRoles = await userFound.getRole()

    if (!userRoles) {
      const err = new Error('')
      err.msg = 'Usuário sem tipo de cadastro!'
      err.code = 500
      throw err
    }

    const hasAccess = userRoles.find(element => {
      if (element.name.includes('servidor') || element.name.includes('administrador')) {
        return true
      } else {
        return false
      }
    })
    if (hasAccess) {
      next()
    } else {
      const err = new Error('')
      err.msg = 'Esse acesso requer acesso de Servidor ou Administrador!'
      err.code = 403
      throw err
    }
  } catch (error) {
    console.error(error)
    if (error && error.code) {
      res.status(error.code).send(error.msg)
    } else {
      res.status(500).send('Houve um erro')
    }
  }
}

module.exports = {
  checkToken,
  checkAdm,
  checkUser,
  checkUserAndAdmin
}
