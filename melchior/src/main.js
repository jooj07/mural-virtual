import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import './plugins/veeValidade'
import './plugins/cookie'
import { ValidationProvider, ValidationObserver } from 'vee-validate'

const loading = () => import('./components/loading.vue')
const snackbar = () => import('./components/snackbar.vue')
const cardExibicao = () => import('./components/card_exibicao.vue')

Vue.component('loading', loading)
Vue.component('snackbar', snackbar)
Vue.component('validation-provider', ValidationProvider)
Vue.component('validation-observer', ValidationObserver)
Vue.component('card-exibicao', cardExibicao)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
