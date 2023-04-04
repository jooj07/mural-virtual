const controllersAuth = require('../controllers/auth.controller')
const controllersCategories = require('../controllers/category.controller')
const controller = require('../controllers/user.controller')
const controllersSections = require('../controllers/section.controller')
const controllersPosts = require('../controllers/post.controllers')
const validator = require('../middlewares/validator')
const authJwt = require('../middlewares/authJwt')
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })

  // --------------------------------------  rotas de usuário

  app.post('/api/auth/cadastro', [
    validator.validateSignUp,
    validator.catchError
  ], (req, res, next) => {
    controllersAuth.signUp(req, res)
  })

  app.post('/api/auth/logar', [
    validator.validateSignIn,
    validator.catchError
  ], (req, res, next) => {
    controllersAuth.signIn(req, res)
  })

  app.post('/api/auth/renova-token', (req, res, next) => {
    controllersAuth.tokenQueExpira(req, res)
  })

  // --------------------------------------  rotas de categorias

  app.get('/api/listar-categorias',
    (req, res, next) => {
      controllersCategories.listCategories(req, res)
    })

  app.post('/api/categorias/nova',
    [
      validator.validateCategory,
      validator.catchError
    ],
    (req, res, next) => {
      controllersCategories.newCategory(req, res)
    })

  app.put('/api/categorias/editar/:id',
    [authJwt.checkToken, authJwt.checkAdm],
    (req, res, next) => {
      controllersCategories.editCategory(req, res)
    })

  app.delete('/api/categorias/deletar/:id',
    [authJwt.checkToken, authJwt.checkAdm],
    (req, res, next) => {
      controllersCategories.deleteCategory(req, res)
    })
  // -------------------------------------- rotas de departamentos

  app.get('/api/departamentos',
    [authJwt.checkToken, authJwt.checkAdm],
    (req, res, next) => {
      controllersSections.listSection(req, res)
    })

  app.post('/api/departamentos/nova',
    [
      authJwt.checkToken,
      authJwt.checkAdm,
      validator.validateCategory,
      validator.catchError
    ],
    (req, res, next) => {
      controllersSections.newSection(req, res)
    })

  app.put('/api/departamentos/editar/:id',
    [authJwt.checkToken, authJwt.checkAdm],
    (req, res, next) => {
      controllersSections.editSections(req, res)
    })

  app.delete('/api/departamentos/deletar/:id',
    [authJwt.checkToken, authJwt.checkAdm],
    (req, res, next) => {
      controllersSections.deleteSection(req, res)
    })
  // -------------------------------------- rotas de posts
  app.get('/api/posts/list',
    (req, res, next) => {
      controllersPosts.listPosts(req, res)
    })

  app.get('/api/posts/list-priority',
    (req, res, next) => {
      controllersPosts.listPriorityPosts(req, res)
    })

  app.put('/api/posts/edit',
    [authJwt.checkToken, authJwt.checkUserAndAdmin],
    (req, res, next) => {
      controllersPosts.alterPost(req, res)
    })

  app.post('/api/posts/new',
    [authJwt.checkToken, authJwt.checkUserAndAdmin],
    (req, res, next) => {
      controllersPosts.newPost(req, res)
    })

  app.delete('/api/posts/delete/:id',
    [authJwt.checkToken, authJwt.checkUserAndAdmin],
    (req, res, next) => {
      controllersPosts.deletePost(req, res)
    })

  // --------------------------------------  rotas para teste, vai desaparecer depois q finalizar
  app.get(
    '/api/test/all',
    controller.allAccess)
  app.get(
    '/api/test/user',
    [authJwt.checkToken],
    controller.userBoard
  )
  app.get(
    '/api/test/mod',
    [authJwt.checkToken, authJwt.checkUser],
    controller.moderatorBoard
  )
  app.get(
    '/api/test/admin',
    [authJwt.checkToken, authJwt.checkUserAndAdmin],
    controller.adminBoard
  )

  // --------------------------------------  crud routes - feed
  app.get('/api/feed/list')
  app.get('/api/feed/list-categories')
  app.get('/api/feed/list-sections')
}
