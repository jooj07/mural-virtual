const database = require('../db')
const Category = require('../models/category')
const db = database
const Op = db.Sequelize.Op

const {
  genareteError,
  returnError
} = require('../utils/generateError')

const newCategory = async (req, res) => {
  try {
    if (!req.body.name) {
      genareteError('Informe um nome para a categoria!', 404)
    }

    const checkIfAlreadyExists = await Category.findOne({
      where: {
        name: req.body.name
      }
    })

    if (checkIfAlreadyExists) {
      genareteError('Categoria já existe!', 404)
    }

    await Category.create({
      name: req.body.name,
      description: req.body.description
    })

    return res.status(200).send('Categoria criada com sucesso')
  } catch (error) {
    returnError(error, res)
  }
}

const editCategory = async (req, res) => {
  try {
    if (!req.body.name) {
      genareteError('Informe um nome para a categoria!', 404)
    }

    const categoryFound = await Category.findByPk(req.params.id)

    const checkIfAlreadyExists = await Category.findOne({
      where: {
        name: req.body.name
      }
    })

    if (checkIfAlreadyExists) {
      genareteError('Categoria já existe com esse nome!', 404)
    }

    if (!categoryFound) {
      genareteError('Categoria não encontrada para editar!', 404)
    }

    await categoryFound.update({
      // id: req.params.id,
      name: req.body.name,
      description: req.body.description
    })

    return res.status(200).send('Categoria editada com sucesso')
  } catch (error) {
    returnError(error, res)
  }
}

const listCategories = async (req, res) => {
  try {
    const where = {}
    if (req.query.name) {
      where.name = {
        [Op.startsWith]: `${req.query.name}`
      }
    }
    if (req.query.ids) {
      where.id = {
        [Op.in]: req.query.ids.map(e => parseInt(e))
      }
    }

    console.log(where)

    const records = await Category.findAndCountAll({
      limit: 10,
      offset: req.query.offset || 0,
      where, // conditions
      order: [
        ['id', 'ASC']
      ]
    })

    return res.json(records)
  } catch (error) {
    returnError(error, res)
  }
}

const showCategory = async (req, res) => {
  try {
    if (!req.params.id) {
      genareteError('Informe o ID da categoria!', 404)
    }
    if (req.params.id && isNaN(req.params.id)) {
      genareteError('Informe o ID da categoria!', 404)
    }

    const item = await Category.findByPk(req.params.id)

    return res.json(item)
  } catch (error) {
    returnError(error, res)
  }
}

const deleteCategory = async (req, res) => {
  try {
    const categoryFound = await Category.findByPk(req.params.id)

    if (!categoryFound) {
      genareteError('Categoria não encontrada para exclusão!', 404)
    }

    await categoryFound.destroy()

    return res.status(200).send('Categoria excluída com sucesso')
  } catch (error) {
    returnError(error, res)
  }
}

module.exports = {
  newCategory,
  editCategory,
  listCategories,
  deleteCategory,
  showCategory
}
