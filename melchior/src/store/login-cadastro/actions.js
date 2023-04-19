import { instance } from '@/plugins/axios'
import router from '@/router/index.js'

export const login = async ({ commit }, form) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.post('/api/auth/logar', form.form)

    commit('SET_USUARIO', dados.data)
  } catch (error) {
    console.log(error)
    if (error && error.response && error.response.data) {
      console.error(error.response.data || error.response.data.message)
      commit('SET_SNACKBAR', {
        timeout: 3000,
        color: 'error',
        snackbar: true,
        text: error.response.data || error.response.data.message
      }, { root: true })
    } else {
      console.error(error.message)
    }
  } finally {
    commit('SET_LOADING', false, { root: true })
  }
}

export const cadastrar = async ({ commit }, form) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.post('/api/auth/cadastro', form)
    if (dados && dados.response && dados.response.status && dados.response.status !== 404) {
      await commit('SET_USUARIO', dados.response.data)
    }
  } catch (error) {
    console.log(error)
    if (error && error.response && error.response.data) {
      console.error(error.response.data || error.response.data.message)
      commit('SET_SNACKBAR', {
        timeout: 3000,
        color: 'error',
        snackbar: true,
        text: error.response.data || error.response.data.message
      }, { root: true })
    } else {
      console.error(error.message)
    }
  } finally {
    commit('SET_LOADING', false, { root: true })
  }
}
export const renovarToken = async ({ commit }) => {
  try {
    const RFSTKN = localStorage.getItem('RFSTKN') || null
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.post('/api/auth/renova-token', {
      tokenRequisicao: RFSTKN
    })
    if (dados && dados.response.status && (dados.response.status === 403 || dados.response.status === 401)) {
      delete instance.defaults.headers.common['x-token']
      localStorage.removeItem('RFSTKN')
      router.push('/autenticacao')
    } else {
      await commit('SET_USUARIO', dados.response.data)
    }
  } catch (error) {
    console.log(error)
    if (error && error.response && error.response.data) {
      console.error(error.response.data || error.response.data.message)
      commit('SET_SNACKBAR', {
        timeout: 3000,
        color: 'error',
        snackbar: true,
        text: error.response.data || error.response.data.message
      }, { root: true })
    } else {
      console.error(error.message)
    }
  } finally {
    commit('SET_LOADING', false, { root: true })
  }
}
