import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false
  },
  getters: {
  },
  mutations: {
    SET_LOADING (state, payload) {
      state.loading = payload
    }
  },
  actions: {
    loadingState ({ commit }, payload) {
      commit('SET_LOADING', payload)
    }
  },
  modules: {
  }
})
