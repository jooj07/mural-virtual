const database = require('../db')
const Post = require('../models/post')
const User = require('../models/user')
const Role = require('../models/role')
const CategoryModel = require('../models/category')
const SectionModel = require('../models/section')
const { QueryTypes } = require('sequelize')
const CryptoJS = require('crypto-js')
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const db = database
const Op = db.Sequelize.Op

const {
  genareteError,
  returnError
} = require('../utils/generateError')

const listarUsuarios = async (req, res) => {
  const post = await User.findByPk(1)
  console.log(Object.keys(post.__proto__))
  try {
    const userRequest = req.query.userId
    const userFound = await User.findByPk(Number(userRequest))
    if (!userFound) genareteError('Você não está logado!', 401)
    const userRoles = await userFound.getRole()
    const isAdm = userRoles.find(element => {
      if (element.name.includes('administrador')) {
        return true
      } else {
        return false
      }
    })

    if (isAdm) {
      const where = {}
      let arecords = null
      if (!req.params.id) {
        if (req.query.name) {
          where.name = {
            [Op.substring]: `${req.query.name}`
          }
        }
        if (req.query.login) {
          where.login = {
            [Op.substring]: `${req.query.login}`
          }
        }
        if (req.query.role) {
          // let roles = null
          // let ids = []
        }
      } else {
        where.id = {
          [Op.eq]: `${req.params.id}`
        }
      }
      arecords = await User.findAll({
        limit: 10,
        offset: req.query.offset || 0,
        attributes: [
          'id',
          'login',
          'email',
          'active',
          'status',
          'expires',
          'name',
          'phone',
          'createdAt',
          'updatedAt',
          'deletedAt'],
        where
      })

      const count = await User.count({
        where
      })

      const records = JSON.parse(JSON.stringify(arecords))

      const aupdatedRows = await Promise.all(records.map(async (iterator) => {
        const roles = await db.query(`
        SELECT r.id, r.name FROM "UserRoles" ur 
        left join "Users" c
        on ur."UserId" = c.id 
        inner join "Roles" r
        on ur."RoleId" = r.id
        and ur."deletedAt" is NULL
        and r."deletedAt" is NULL
        and c."deletedAt" is null
        where ur."UserId" = ${iterator.id}; `, { type: QueryTypes.SELECT })
        iterator.roles = roles
        return iterator
      }))

      const updatedRows = JSON.parse(JSON.stringify(aupdatedRows))

      return res.json({ count, rows: updatedRows })
    } else {
      genareteError('Você não tem permissão para acessar isso!', 401)
    }
  } catch (error) {
    returnError(error, res)
  }
}

const gerenciarUsuario = async (req, res) => {
  try {
    console.log(req.body)
    const userRequest = req.body.userId
    const userFound = await User.findByPk(Number(userRequest))
    if (!userFound) genareteError('Você não está logado!', 401)
    const userRoles = await userFound.getRole()
    const isAdm = userRoles.find(element => {
      if (element.name.includes('administrador')) {
        return true
      } else {
        return false
      }
    })
    if (isAdm) {
      const userFound = await User.findByPk(Number(req.body.id))
      if (!userFound) genareteError('Usuário não encontrado!', 404)
      if (req.query.desativar) {
        await userFound.update({
          active: false
        })
      }
      if (req.query.ativar) {
        await userFound.update({
          active: true
        })
      }
      if (req.query.setarExpire) {
        await userFound.update({
          expires: req.query.expires
        })
      }
      if (req.query.removeRole) {
        const role = await userFound.hasRole(req.query.addRole)
        // const roleExiste = Role.findByPk(req.query.addRole)
        if (role) {
          genareteError('Usuário já possui este acesso!', 404)
        } else {
          await userFound.removeRole(req.query.removeRole)
        }
      }
      if (req.query.addRole) {
        await userFound.addRole(Number(req.query.addRole))
      }
      if (req.body) {
        console.log(Object.keys(userFound.__proto__))
        const rolesToEdit = req.body.roles
        const rolesUser = await userFound.getRole()
        if (rolesUser && rolesUser.length && !_.isEqual(rolesToEdit, rolesUser.map(i => i.id))) {
          if (rolesUser && rolesUser.length) {
            for (const i of rolesUser) {
              console.log(i.id)
              await userFound.removeRole(i.id)
            }
          }
          if (rolesToEdit && rolesToEdit.length) {
            for (const i of rolesToEdit) {
              await userFound.addRole(Number(i))
            }
          }
        }
        if (!rolesUser && rolesToEdit && rolesToEdit.length) {
          if (rolesToEdit && rolesToEdit.length) {
            for (const i of rolesToEdit) {
              await userFound.addRole(Number(i))
            }
          }
        }
        await userFound.update(req.body)
      }
    } else {
      genareteError('Você não tem permissão para acessar isso!', 401)
    }
    return res.status(200).send('Usuário editado com sucesso!')
  } catch (error) {
    returnError(error, res)
  }
}

const excluirUsuario = async (req, res) => {
  try {
    const userRequest = req.query.userId
    const userFound = await User.findByPk(Number(userRequest))
    if (!userFound) genareteError('Você não está logado!', 401)
    const userRoles = await userFound.getRole()
    const isAdm = userRoles.find(element => {
      if (element.name.includes('administrador')) {
        return true
      } else {
        return false
      }
    })
    if (isAdm) {
      const userFound = await User.findByPk(Number(req.query.id))
      if (!userFound) genareteError('Usuário não encontrado!', 404)
      await userFound.destroy()
    } else {
      genareteError('Você não tem permissão para acessar isso!', 401)
    }
    return res.status(200).send('Usuário excluído com sucesso!')
  } catch (error) {
    returnError(error, res)
  }
}

const alterarSenha = async (req, res) => {
  try {
    const userRequest = req.body.userId
    const userFound = await User.findByPk(Number(userRequest))

    if (!userFound) genareteError('Você não está logado!', 401)
    const userRoles = await userFound.getRole()
    const isAdm = userRoles.find(element => {
      if (element.name.includes('administrador')) {
        return true
      } else {
        return false
      }
    })
    if (isAdm) {
      const userFound = await User.findByPk(Number(req.body.id))
      if (!userFound) genareteError('Usuário não encontrado!', 404)

      const passphrase = process.env.CHAVE_TRADUTORA
      const bytes = CryptoJS.AES.decrypt(req.body.password, passphrase)
      req.body.password = bytes.toString(CryptoJS.enc.Utf8)
      const senhaEncript = bcrypt.hashSync(req.body.password, 8)

      await userFound.update({
        password: senhaEncript
      })
    } else {
      genareteError('Você não tem permissão para acessar isso!', 401)
    }
    return res.status(200).send('Senha alterada com sucesso!')
  } catch (error) {
    returnError(error, res)
  }
}

const allAccess = async (req, res) => {
  res.status(200).send('Public Content.')
}

const userBoard = async (req, res) => {
  res.status(200).send('User Content.')
}

const adminBoard = async (req, res) => {
  res.status(200).send('Admin Content.')
}

const moderatorBoard = async (req, res) => {
  res.status(200).send('Moderator Content.')
}

module.exports = {
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard,
  listarUsuarios,
  gerenciarUsuario,
  excluirUsuario,
  alterarSenha
}
