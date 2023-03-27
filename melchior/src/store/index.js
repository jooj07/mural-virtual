import Vue from 'vue'
import Vuex from 'vuex'
import categorias from './categorias'
import departamentos from './departamentos'
import loginCadastro from './login-cadastro'
import feed from './feed'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    snackbar: {
      timeout: 2000,
      color: 'primary',
      snackbar: false,
      text: ''
    }
  },
  getters: {
  },
  mutations: {
    SET_LOADING (state, payload) {
      state.loading = payload
    },
    SET_SNACKBAR (state, payload) {
      if (!payload) {
        state.snackbar = {
          timeout: 2000,
          color: 'primary',
          snackbar: false,
          text: ''
        }
      } else {
        state.snackbar = {
          timeout: payload.timeout || 2000,
          color: payload.color || 'primary',
          snackbar: payload.snackbar || false,
          text: payload.text || ''
        }
      }
    }
  },
  actions: {
    loadingState ({ commit }, payload) {
      commit('SET_LOADING', payload)
    }
  },
  modules: {
    categorias,
    departamentos,
    loginCadastro,
    feed
  }
})
