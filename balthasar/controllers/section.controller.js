const database = require('../db')
const Section = require('../models/section')
const db = database
const Op = db.Sequelize.Op
const { QueryTypes } = require('sequelize')

const {
  genareteError,
  returnError
} = require('../utils/generateError')

const newSection = async (req, res) => {
  try {
    if (!req.body.name) {
      genareteError('Informe um nome para o Departamento!', 404)
    }

    const checkIfAlreadyExists = await Section.findOne({
      where: {
        name: req.body.name
      }
    })

    if (checkIfAlreadyExists) {
      genareteError('Departamento já existe!', 404)
    }

    await Section.create({
      name: req.body.name,
      description: req.body.description
    })

    return res.status(200).send('Departamento criado com sucesso')
  } catch (error) {
    returnError(error, res)
  }
}

const editSections = async (req, res) => {
  try {
    if (!req.body.name) {
      genareteError('Informe um nome para o Departamento!', 404)
    }

    const SectionFound = await Section.findByPk(req.params.id)

    if (!SectionFound) {
      genareteError('Departamento não encontrado para editar!', 404)
    }

    await SectionFound.update({
      name: req.body.name,
      description: req.body.description
    })

    return res.status(200).send('Departamento editado com sucesso')
  } catch (error) {
    returnError(error, res)
  }
}

const listSection = async (req, res) => {
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

    const records = await Section.findAndCountAll({
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

const showSection = async (req, res) => {
  try {
    if (!req.params.id) {
      genareteError('Informe o ID do departamento!', 404)
    }
    if (req.params.id && isNaN(req.params.id)) {
      genareteError('Informe o ID do departamento!', 404)
    }

    const item = await Section.findByPk(req.params.id)

    return res.json(item)
  } catch (error) {
    returnError(error, res)
  }
}

const deleteSection = async (req, res) => {
  try {
    const SectionFound = await Section.findByPk(req.params.id)

    if (!SectionFound) {
      genareteError('Departamento não encontrado para exclusão!', 404)
    }

    const existePostAtivo = await db.query(`
    SELECT *
    FROM "PostSections" ps 
    LEFT JOIN "Posts" p ON ps."PostId" = p.id
    LEFT JOIN "Sections" s ON ps."SectionId" = s.id
    WHERE p."deletedAt" IS NULL and p."expiresAt" > NOW()
    AND s.id = ${req.params.id}; `, { type: QueryTypes.SELECT })

    console.log(existePostAtivo)

    if (existePostAtivo && existePostAtivo.length) {
      genareteError('Existem posts ativos neste departamento, exclua-os ou altere a data de expiração!', 404)
    } else {
      await SectionFound.destroy()
    }

    return res.status(200).send('Departamento excluída com sucesso')
  } catch (error) {
    returnError(error, res)
  }
}

module.exports = {
  newSection,
  editSections,
  listSection,
  deleteSection,
  showSection
}
