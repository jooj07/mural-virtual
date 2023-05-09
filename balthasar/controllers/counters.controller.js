// const database = require('../db')
const Section = require('../models/section')
const Post = require('../models/post')
const User = require('../models/user')
const Category = require('../models/category')
// const db = database
// const Op = db.Sequelize.Op

const {
  // genareteError,
  returnError
} = require('../utils/generateError')

const count = async (req, res) => {
  try {
    const categorias = await Category.count()
    const sections = await Section.count()
    const posts = await Post.count()
    const users = await User.count()

    const obj = [{
      titulo: 'Categorias Cadastradas',
      link: '/dashboard/categorias',
      contador: `${categorias}`
    },
    {
      titulo: 'Departamentos Cadastrados',
      link: '/dashboard/departamentos',
      contador: `${sections}`
    },
    {
      titulo: 'Posts Feitos',
      link: '/dashboard/atividades',
      contador: `${posts}`
    },
    {
      titulo: 'Usuários Cadastrados',
      link: '/dashboard/usuarios',
      contador: `${users}`
    }
    ]

    return res.json(obj)
  } catch (error) {
    returnError(error, res)
  }
}

module.exports = {
  count
}
