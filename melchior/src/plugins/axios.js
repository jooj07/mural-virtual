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
    const originalRequest = error.config
    // Se a resposta retornar um erro 403
    if ((error.response.status === 403 || error.response.status === 401) && !originalRequest._retry && originalRequest.url !== '/api/auth/renova-token') {
      originalRequest._retry = true

      // Fazer uma nova chamada para obter um novo token de sessão usando o refresh token
      try {
        const res = await instance.post('/api/auth/renova-token', {
          tokenRequisicao: RFSTKN
        })

        // Se o refresh token for válido, atualizar o token no armazenamento local e no cabeçalho da requisição
        if (res.status === 200) {
          instance.defaults.headers.common['x-token'] = `${res.data.token}`
          store.commit('loginCadastro/SET_USUARIO', res.data)
          return instance(originalRequest)
        }
      } catch (error) {
        delete axios.defaults.headers.common['x-token']
        localStorage.removeItem('RFSTKN')
        localStorage.removeItem('usuarioLogado')
        router.push('/autenticacao')
      }
    }

    return Promise.reject(error)
  }
)

export default instance
