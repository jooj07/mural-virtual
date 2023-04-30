import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'

Vue.use(VueRouter)
console.log(store)
const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '../layouts/app'),
    children: [
      {
        path: '',
        name: 'Feed',
        component: () => import(/* webpackChunkName: "home" */ '../views/feed')
      },
      // Protegidas
      {
        path: '/dashboard',
        name: 'Seu Dashboard',
        meta: { logado: true, adm: true },
        component: () => import(/* webpackChunkName: "dashboard" */ '../layouts/dashboard.vue'),
        children: [
          {
            path: '/dashboard/atividades',
            name: 'Atividades',
            component: () => import(/* webpackChunkName: "Atividades" */ '../views/atividades'),
            meta: { logado: true, adm: true }
          },
          {
            path: '/dashboard/categorias',
            name: 'Categorias',
            component: () => import(/* webpackChunkName: "Categorias" */ '../views/categorias'),
            meta: { logado: true, adm: true }
          },
          {
            path: '/dashboard/usuarios',
            name: 'Usuários',
            component: () => import(/* webpackChunkName: "usuarios" */ '../views/usuarios'),
            meta: { logado: true, adm: true }
          },
          {
            path: '/dashboard/departamentos',
            name: 'Departamentos',
            component: () => import(/* webpackChunkName: "departamentos" */ '../views/departamentos'),
            meta: { logado: true, adm: true }
          }
        ]
      }
      // ---
    ]
  },
  {
    path: '/autenticacao',
    component: () => import(/* webpackChunkName: "autenticacao" */ '../layouts/autenticacao'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '../views/login')
      },
      {
        path: '/autenticacao/cadastro',
        name: 'Cadastro',
        component: () => import(/* webpackChunkName: "cadastro" */ '../views/cadastro')
      }
    ]
  },
  {
    path: '/403',
    name: '403',
    component: () => import(/* webpackChunkName: "403" */ '../views/403')
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// router.beforeEach(async (to, from, next) => {
//   // if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
//   // else
//   console.log('GLOBAL')
//   if (to.meta.logado) {
//     if (!localStorage.getItem('RFSTKN')) next('/403')

//     if (localStorage.getItem('RFSTKN') && !store.state.usuarioLogado) {
//       await store.dispatch('loginCadastro/renovarToken')
//     }
//     console.log(store.state.loginCadastro)

//     if (to.meta.adm) {
//       // if (store.state.loginCadastro.state.usuarioLogado.tipo !== 'adm') next('/403')
//     }
//   } else {
//     next()
//   }
//   // else if(to.meta.adm && localStorage.getItem('RFSTKN') && store.state.loginCadastro.usuarioLogado.tipo !== 'adm') {

//   // }
// })

export default router
