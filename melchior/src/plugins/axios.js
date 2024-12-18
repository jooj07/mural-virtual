import axios from 'axios'
import Vue from 'vue'
import VueCookies from 'vue-cookies'
import router from '@/router/index.js'
import store from '../store/index.js'
Vue.use(VueCookies)
export const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 10000,
  'Access-Control-Allow-Origin': '*'
})

const RFSTKN = localStorage.getItem('RFSTKN') || null
if (RFSTKN) {
  instance.defaults.headers.common['x-token'] = `${RFSTKN}`
}

// Interceptador de resposta
instance.interceptors.response.use(
  async (response) => {
    const usuarioLogadoVuex = store.state.loginCadastro.usuarioLogado
    if (!usuarioLogadoVuex) {
      const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')) || null
      if (usuarioLogado) {
        store.commit('loginCadastro/SET_USUARIO', usuarioLogado)
      }
    }
    return response
  },
  async (error) => {
    // Se a resposta retornar um erro 403
    if ((error.response.status === 403 || error.response.status === 401)) {
      delete axios.defaults.headers.common['x-token']
      localStorage.removeItem('RFSTKN')
      localStorage.removeItem('usuarioLogado')
      router.push('/autenticacao')
      if (error.response?.data) {
        if (error.response.data.includes('Senha incorreta')) {
          return Promise.reject(error)
        }
        if (error.response.data.includes('Usuário expirado!')) {
          return Promise.reject(error)
        }
        window.alert('Sua sessão expirou, por favor, faça login novamente.')
      }
    }

    return Promise.reject(error)
  }
)

export default instance
