import Vue from 'vue'
import Vuex from 'vuex'
import categorias from './categorias'
import departamentos from './departamentos'
import loginCadastro from './login-cadastro'
import feed from './feed'
import usuarios from './usuarios'
import { instance } from '@/plugins/axios'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loading: false,
    snackbar: {
      timeout: 2000,
      color: 'primary',
      snackbar: false,
      text: ''
    },
    opcoes: null,
    controlador: '',
    filtrosBusca: {
      categoriaSelecionada: [],
      departamentoSelecionado: [],
      tituloPesquisa: null
    },
    paginaPosts: 1
  },
  getters: {
  },
  mutations: {
    SET_LOADING (state, payload) {
      state.loading = payload
    },
    SET_CONTROLADOR (state, payload) {
      state.controlador = payload
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
    },
    SET_OPCOES (state, payload) {
      state.opcoes = payload
    },
    SET_FILTROS_BUSCA (state, payload) {
      state.filtrosBusca = payload
    },
    SET_PAGINA_POSTS (state, payload) {
      state.paginaPosts = payload
    }
  },
  actions: {
    loadingState ({ commit }, payload) {
      commit('SET_LOADING', payload)
    },
    async obterOpcoes ({ commit }) {
      try {
        commit('SET_LOADING', true, { root: true })
        const dados = await instance.get('/api/totalizadores')
        if (dados && dados && dados.status && dados.status !== 404) {
          commit('SET_OPCOES', dados.data)
        }
      } catch (error) {
        if (error && error && error.data) {
          console.error(error.data || error.data.message)
          commit('SET_SNACKBAR', {
            timeout: 3000,
            color: 'error',
            snackbar: true,
            text: error.data || error.data.message
          }, { root: true })
        } else {
          console.error(error.message)
        }
      } finally {
        commit('SET_LOADING', false, { root: true })
      }
    }

  },
  modules: {
    categorias,
    departamentos,
    loginCadastro,
    feed,
    usuarios
  }
})

export default store
