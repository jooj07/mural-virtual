const database = require('../db')
const Post = require('../models/post')
const User = require('../models/user')
const db = database
const Op = db.Sequelize.Op

const {
  genareteError,
  returnError
} = require('../utils/generateError')

// aberto a todos
const listPosts = async (req, res) => {
  try {
    // TODO Pesquisa por departamento
    // TODO Pesquisa por categoria
    const where = {}
    if (req.query.name) {
      where.name = {
        [Op.startsWith]: `${req.query.name}`
      }
    }
    if (req.query.createdAt) {
      where.createdAt = {
        [Op.startsWith]: `${req.query.createdAt}`
      }
    }

    const records = await Post.findAndCountAll({
      limit: 2,
      offset: 0,
      where // conditions
    })

    return res.json(records)
  } catch (error) {
    returnError(error, res)
  }
}

const listPriorityPosts = async (req, res) => {
  try {
    const recordsWithPriority = await Post.findAndCountAll({
      limit: 2,
      offset: 0,
      where: {
        priority: {
          [Op.gt]: 0
        }
      }
    })

    return res.json(recordsWithPriority)
  } catch (error) {
    returnError(error, res)
  }
}

// apenas para quem escreveu
// apenas para logados
// enviar o id de usuário no header para comparações
const alterPost = async (req, res) => {
  try {
    // TODO console.log(Object.keys(post.__proto__)) OBTER OS MÉTODOS DE RELACIONAMENO DAS INSTÂNCIAS
    // Check se trás o id do usuário

    if (req.headers && !req.headers['x-user']) throw new Error('Você não está logado!')
    const userRequest = req.headers['x-user']
    const userFound = await User.findByPk(Number(userRequest))
    if (!userFound) genareteError('Você não está logado!', 401)

    // Check se o post existe
    if (!req.body.id) throw new Error('Post não econtrado para editar!')
    const postFound = await Post.findByPk(Number(req.body.id))
    if (!postFound) genareteError('Post não econtrado para editar!', 500)

    // Check se o post pertence ao usuário
    // Antes, checa se é adm
    const userRoles = await userFound.getRole()
    const isAdm = userRoles.find(element => {
      if (element.name.includes('administrador')) {
        return true
      } else {
        return false
      }
    })
    // Agora sim, vamos buscar o post e ver se pertence ao usuário requisitando
    const postUser = await postFound.hasUser(userFound.id)
    if (isAdm || postUser) {
      postFound.update(req.body)
    } else {
      genareteError('Você não tem permissão para editar isso!', 401)
    }
    return res.status(200).send('Post editado com sucesso!')
  } catch (error) {
    returnError(error, res)
  }
}

const deletePost = async (req, res) => {
  try {
    // TODO console.log(Object.keys(post.__proto__)) OBTER OS MÉTODOS DE RELACIONAMENO DAS INSTÂNCIAS
    // Check se trás o id do usuário

    if (req.headers && !req.headers['x-user']) genareteError('Você não está logado!', 401)

    const userRequest = req.headers['x-user']
    const userFound = await User.findByPk(Number(userRequest))

    if (!userFound) genareteError('Você não está logado!', 401)

    // Check se o post existe
    if (!req.body.id) genareteError('Post não econtrado para editar!', 500)

    const postFound = await Post.findByPk(Number(req.body.id))
    if (!postFound) genareteError('Post não econtrado para editar!', 500)

    // Check se o post pertence ao usuário
    // Antes, checa se é adm
    const userRoles = await userFound.getRole()
    const isAdm = userRoles.find(element => {
      if (element.name.includes('administrador')) {
        return true
      } else {
        return false
      }
    })
    // Agora sim, vamos buscar o post e ver se pertence ao usuário requisitando
    const postUser = await postFound.hasUser(userFound.id)
    if (isAdm || postUser) {
      postFound.destroy(req.params.id)
    } else {
      genareteError('Você não tem permissão para deletar isso!', 401)
    }
    return res.status(200).send('Post excluído com sucesso!')
  } catch (error) {
    returnError(error, res)
  }
}

const newPost = async (req, res) => {
  try {
    // TODO console.log(Object.keys(post.__proto__)) OBTER OS MÉTODOS DE RELACIONAMENO DAS INSTÂNCIAS
    /*
      [
        '_customGetters',    '_customSetters',
        'validators',        '_hasCustomGetters',
        '_hasCustomSetters', 'rawAttributes',
        '_isAttribute',      'getCategory',
        'countCategory',     'hasCategory',
        'setCategory',       'addCategory',
        'removeCategory',    'createCategory',
        'getSection',        'countSection',
        'hasSection',        'setSection',
        'addSection',        'removeSection',
        'createSection',     'getUser',
        'countUser',         'hasUser',
        'setUser',           'addUser',
        'removeUser',        'createUser'
      ]
    */
    // Usuário
    const userRequest = req.headers['x-user']
    const userFound = await User.findByPk(Number(userRequest))
    if (!userFound) genareteError('Você não está logado!', 401)
    // Title
    const {
      name
    } = req.body
    //  Autor
    const isThereAnyPost = await Post.findOne({
      name
    })
    if (isThereAnyPost) genareteError('Já existe um post como esse!', 500)
    const postCreated = await Post.create({
      name
    })

    await postCreated.setUser(userFound.id)

    // const a = {
    //   id: {
    //     type: 'Sequelize.INTEGER',
    //     primaryKey: true,
    //     autoIncrement: true
    //   },
    //   name: {
    //     type: 'Sequelize.STRING',
    //     allowNull: false
    //   },
    //   description: {
    //     type: 'Sequelize.STRING',
    //     allowNull: true
    //   },
    //   content: {
    //     type: 'Sequelize.BLOB',
    //     allowNull: true
    //   },
    //   expiresAt: {
    //     type: 'Sequelize.DATE',
    //     allowNull: true
    //   },
    //   active: {
    //     type: 'Sequelize.BOOLEAN',
    //     defaultValue: true
    //   },
    //   moreInfo: {
    //     type: 'Sequelize.BLOB',
    //     allowNull: true
    //   },
    //   priority: {
    //     type: 'Sequelize.INTEGER',
    //     defaultValue: 0
    //   },
    //   status: {
    //     type: 'Sequelize.INTEGER',
    //     allowNull: false,
    //     defaultValue: 1 // em aprovação
    //   }
    // }
    await postCreated.save()
    return res.status(200).send('Post salvo com sucesso!')
  } catch (error) {
    returnError(error, res)
  }
}

module.exports = {
  listPosts,
  listPriorityPosts,
  alterPost,
  deletePost,
  newPost
}
