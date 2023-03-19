import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home layout',
    component: () => import(/* webpackChunkName: "home" */ '../layouts/app'),
    children: [
      {
        path: '',
        name: 'Feed',
        component: () => import(/* webpackChunkName: "home" */ '../views/feed')
      },
      {
        path: '/dashboard',
        name: 'Seu Dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '../layouts/dashboard.vue'),
        children: [
          {
            path: '/dashboard/atividades',
            name: 'Atividades',
            component: () => import(/* webpackChunkName: "Atividades" */ '../views/atividades')
          },
          {
            path: '/dashboard/categorias',
            name: 'Categorias',
            component: () => import(/* webpackChunkName: "Categorias" */ '../views/categorias')
          },
          {
            path: '/dashboard/usuarios',
            name: 'Usuários',
            component: () => import(/* webpackChunkName: "usuarios" */ '../views/usuarios')
          },
          {
            path: '/dashboard/departamentos',
            name: 'Departamentos',
            component: () => import(/* webpackChunkName: "departamentos" */ '../views/departamentos')
          }
        ]
      }
    ]
  }

  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
