// index.js

(async () => {
  const Category = require('/workspaces/models/category.js')
  const Post = require('/workspaces/models/post.js')
  const PostCategory = require('/workspaces/models/postCategory.js')
  const PostSection = require('/workspaces/models/postSection.js')
  const Question = require('/workspaces/models/question.js')
  const Role = require('/workspaces/models/role.js')
  const Section = require('/workspaces/models/section.js')
  const User = require('/workspaces/models/user.js')
  const database = require('/workspaces/db.js')
  const UserPost = require('/workspaces/models/userPost.js')
  const UserQuestion = require('/workspaces/models/userQuestions.js')
  const UserRole = require('/workspaces/models/userRole.js')
  const UserSection = require('/workspaces/models/userSection.js')
  const tokenEfemero = require('/workspaces/models/tokenEfemero.js')
  try {

    await database.sync({ alter: true })

    /*
    https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization :
    User.sync({ force: true }) - This creates the table, dropping it first if it already existed

    User.sync({ alter: true }) - This checks what is the current state of the table in the database 
    (which columns it has, what are their data types, etc), and then performs the necessary changes 
    in the table to make it match the model.
    
    */
  //  criando as relações
    Section.belongsToMany(Post, {
      through: PostSection,
      onDelete: 'CASCADE',
      as: 'post'
    })
    Section.belongsToMany(User, {
      through: UserSection,
      onDelete: 'CASCADE',
      as: 'user'
    })

    User.belongsToMany(Post, {
      through: UserPost,
      onDelete: 'CASCADE',
      as: 'post'
    })
    User.belongsToMany(Question, {
      through: UserQuestion,
      onDelete: 'CASCADE',
      as: 'question'
    })
    User.belongsToMany(Section, {
      through: UserSection,
      onDelete: 'CASCADE',
      as: 'section'
    })

    tokenEfemero.belongsTo(User, {
      foreignKey: 'userId', targetKey: 'id'
    });
    User.hasOne(tokenEfemero, {
      foreignKey: 'userId', targetKey: 'id'
    });

    Question.belongsToMany(User, {
      through: UserQuestion,
      onDelete: 'CASCADE',
      as: 'user'
    })

    Post.belongsToMany(Category, {
      through: PostCategory,
      onDelete: 'CASCADE',
      as: 'category'
    })
    Post.belongsToMany(Section, {
      through: PostSection,
      onDelete: 'CASCADE',
      as: 'section'
    })
    Post.belongsToMany(User, {
      through: UserPost,
      onDelete: 'CASCADE',
      as: 'user'
    })

    Category.belongsToMany(Post, {
      through: PostCategory,
      onDelete: 'CASCADE',
      as: 'post'
    })

    Role.belongsToMany(User, {
      through: UserRole,
      onDelete: 'CASCADE',
      as: 'user'
    })

    User.belongsToMany(Role, {
      through: UserRole,
      onDelete: 'CASCADE',
      as: 'role'
    })
    // Cria os acessos
    Role.findOrCreate({
      where: { name: 'usuario' }
    })
    Role.findOrCreate({
      where: { name: 'servidor' }
    })
    Role.findOrCreate({
      where: { name: 'administrador' }
    })

  } catch (error) {
    console.log(error)
  }
})()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

// const corsOptions = {
//   origin: 'http://localhost:8081'
// }
app.use(cors({ origin: '*' }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/', (req, res) => {
  res.json({
    message: 'API executando, tudo segue normal (por enquanto)'
  })
})

// rotas de acesso
require('./routes/routes')(app)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Servidor executando em http://localhost:${PORT}.`)
})
