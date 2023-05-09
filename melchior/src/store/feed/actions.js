import { instance } from '@/plugins/axios'

export const listarPosts = async ({ commit }) => {
  try {
    await instance.get('/api/test/user')
    commit('SET_POSTS', null)
    // if (resposta && resposta.data) {
    // }
  } catch (error) {
    console.log(error.message)
  }
}

export const obterFiltroDepartamentos = async ({ commit }) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.get('/api/departamentos')
    if (dados && dados.response && dados.response.status && dados.response.status !== 404) {
      await commit('SET_DEPARTAMENTOS', dados.response.data)
    }
  } catch (error) {
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

export const obterFiltroCategorias = async ({ commit }) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.get('/api/categorias')
    if (dados && dados.response && dados.response.status && dados.response.status !== 404) {
      await commit('SET_CATEGORIAS', dados.response.data)
    }
  } catch (error) {
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
