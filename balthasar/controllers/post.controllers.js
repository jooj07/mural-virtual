const database = require('../db')
const Post = require('../models/post')
const User = require('../models/user')
const CategoryModel = require('../models/category')
const SectionModel = require('../models/section')
const PostCategory = require('../models/postCategory')
const PostSection = require('../models/postSection')
const { QueryTypes } = require('sequelize')
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
    where.expiresAt = {
      [Op.gte]: new Date()
    }
    let arecords = null
    if (!req.params.id) {
      if (req.query.name) {
        where.name = {
          [Op.substring]: `${req.query.name}`
        }
      }
      if (req.query.category || req.query.section) {
        let categories = null
        let sections = null
        let ids = []

        if (req.query.category && req.query.category.length) {
          categories = await CategoryModel.findAll({
            where: {
              id: {
                [Op.in]: req.query.category
              }
            }
          })
        }

        if (req.query.section && req.query.section.length) {
          sections = await SectionModel.findAll({
            where: {
              id: {
                [Op.in]: req.query.section
              }
            }
          })
        }

        if (categories && categories.length) {
          const sql = `SELECT "PostId" FROM "PostCategories" where "CategoryId" in (${categories.map(x => x.id)})`
          const search = await db.query(sql, { type: QueryTypes.SELECT })
          const array = search.map(x => x.PostId)
          ids = ids.concat(array)
          if (array && array.length) {
            ids = ids.concat(array)
          } else {
            ids = ids.concat([0])
          }
        }
        if (sections && sections.length) {
          const sql = `SELECT "PostId" FROM "PostSections" where "SectionId" in (${sections.map(x => x.id)})`
          const search = await db.query(sql, { type: QueryTypes.SELECT })
          const array = search.map(x => x.PostId)
          if (array && array.length) {
            ids = ids.concat(array)
          } else {
            ids = ids.concat([0])
          }
        }

        let arraySemRepeticoes = []
        if (ids && ids.length) {
          arraySemRepeticoes = ids.filter((item, index) => {
            return ids.indexOf(item) === index
          })
        }

        if (arraySemRepeticoes && arraySemRepeticoes.length) {
          where.id = {
            [Op.in]: arraySemRepeticoes
          }
        }
      }
    } else {
      where.id = {
        [Op.eq]: `${req.params.id}`
      }
    }
    arecords = await Post.findAll({
      limit: 10,
      offset: req.query.offset || 0,
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'] // escolha os atributos que deseja retornar do usuário
        }
      ]
    })

    const count = await Post.count({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'] // escolha os atributos que deseja retornar do usuário
        }
      ]
    })

    const records = JSON.parse(JSON.stringify(arecords))

    const aupdatedRows = await Promise.all(records.map(async (iterator) => {
      const categories = await db.query(`
      SELECT *, name AS "text" FROM "PostCategories" pc 
      left join "Categories" c
      on pc."CategoryId" = c.id 
      where pc."PostId" = ${iterator.id}
      and pc."deletedAt" is NULL
      and c."deletedAt" is NULL `, { type: QueryTypes.SELECT })
      const sections = await db.query(`
      SELECT *, name AS "text" FROM "PostSections" ps
      left join "Sections" s
      on ps."SectionId" = s.id
      where ps."PostId" = ${iterator.id}
      and ps."deletedAt" is NULL
      and s."deletedAt" is NULL
      `, { type: QueryTypes.SELECT })
      iterator.categories = categories
      iterator.sections = sections
      return iterator
    }))
    const updatedRows = JSON.parse(JSON.stringify(aupdatedRows))

    return res.json({ count, rows: updatedRows })
  } catch (error) {
    returnError(error, res)
  }
}

const listPriorityPosts = async (req, res) => {
  try {
    const recordsWithPriority = await Post.findAndCountAll({
      limit: 10,
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

    if (!req.body.userId) throw new Error('Você não está logado!')
    const userRequest = req.body.userId
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
      await postFound.update(req.body)
      if (req.body && req.body.categories) {
        const categoriasAssociadas = await PostCategory.findAll({
          where: {
            PostId: {
              [Op.eq]: postFound.id
            }
          }
        })
        if (categoriasAssociadas && categoriasAssociadas.length) {
          await PostCategory.destroy({ where: { PostId: postFound.id } })
        }

        for (const i of req.body.categories) {
          const categoryFound = await CategoryModel.findByPk(Number(i))
          if (!categoryFound) genareteError('Categoria não encontrada!', 500)
          await postFound.addCategory(categoryFound.id)
        }
      }
      if (req.body && req.body.sections) {
        const deptsAssociadas = await PostSection.findAll({
          where: {
            PostId: {
              [Op.eq]: postFound.id
            }
          }
        })
        if (deptsAssociadas && deptsAssociadas.length) {
          await PostSection.destroy({ where: { PostId: postFound.id } })
        }

        for (const i of req.body.sections) {
          const sectionFound = await SectionModel.findByPk(Number(i))
          if (!sectionFound) genareteError('Departamento não encontrado!', 500)
          await postFound.addSection(sectionFound.id)
        }
      }
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

    const userRequest = req.query.userId
    const userFound = await User.findByPk(Number(userRequest))
    if (!userFound) genareteError('Você não está logado!', 401)

    // Check se o post existe
    if (!req.query.id) genareteError('Post não econtrado!', 500)

    const postFound = await Post.findByPk(Number(req.query.id))
    if (!postFound) genareteError('Post não econtrado!', 500)

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
    const {
      name,
      description,
      content,
      expiresAt,
      active,
      moreInfo,
      priority,
      status, // 1-rascunho, 2-finalizado
      category,
      section,
      userId
    } = req.body
    // Usuário
    const userRequest = userId

    const userFound = await User.findByPk(Number(userRequest))
    if (!userFound) genareteError('Você não está logado!', 401)

    //  Autor
    const isThereAnyPost = await Post.findOne({
      where: {
        name
      }
    })
    if (isThereAnyPost) genareteError('Já existe um post com este título!', 500)

    const postCreated = await Post.create({
      name,
      description,
      content,
      expiresAt,
      active,
      moreInfo,
      priority,
      status
    })

    for (const i of category) {
      const categoryFound = await CategoryModel.findByPk(Number(i))
      if (!categoryFound) genareteError('Categoria não encontrada!', 500)
      await postCreated.addCategory(categoryFound.id)
    }
    for (const i of section) {
      const sectionFound = await SectionModel.findByPk(Number(i))
      if (!sectionFound) genareteError('Departamento não encontrado!', 500)
      await postCreated.addSection(sectionFound.id)
    }

    await postCreated.setUser(userFound.id)

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
