import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
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
    meta: { rotaLogin: true },
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
    name: '403 - Sem permissão',
    component: () => import(/* webpackChunkName: "403" */ '../views/403')
  },
  {
    path: '*',
    name: '404 - Página não encontrada',
    component: () => import(/* webpackChunkName: "404" */ '../views/404')
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const usuarioLogado = localStorage.getItem('RFSTKN') || null
  let usuarioLogadoVuex = localStorage.getItem('usuarioLogado') || null
  usuarioLogadoVuex = usuarioLogadoVuex ? JSON.parse(usuarioLogadoVuex) : null
  if (to.matched.some(record => record.meta.rotaLogin) && usuarioLogado) {
    router.push({ path: '/' })
  }
  if (to.matched.some(record => record.meta.logado) && !usuarioLogado) {
    router.push({ path: '/autenticacao' })
  } else if (
    to.matched.some(record => record.meta.adm) &&
    usuarioLogadoVuex && usuarioLogadoVuex.acessos &&
    usuarioLogado &&
    !usuarioLogadoVuex.acessos.includes('administrador')
  ) {
    router.push({ path: '/403' })
  } else {
    next()
  }
})

// router.beforeEach(async (to, from, next) => {
//   const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')) || null
//   const acessos = []

//   if (usuarioLogado && usuarioLogado.length > 0 && usuarioLogado.acessos && usuarioLogado.acessos.length > 0) {
//     usuarioLogado.acessos.forEach(acesso => {
//       acessos.push(acesso)
//     })
//   }

//   window.console.log('acessos', acessos)

//   if (to.matched.some(record => record.meta.logado) && !usuarioLogado) {
//     next(false)
//     router.push({ path: '/' })
//     return
//   }

//   if (to.matched.some(record => record.meta.adm) && (!usuarioLogado || !acessos.includes('administrador'))) {
//     next({ path: '/' })
//     return
//   }

//   if (to.matched.some(record => record.meta.servidor) && !acessos.includes('servidor')) {
//     // Se não estamos no modo de servidor, navegar para a página de login
//     next({ path: '/' })
//     return
//   }

//   next()
// })

export default router
