import { instance } from '@/plugins/axios'

export const listarUsuarios = async ({ commit }, parametros) => {
  window.console.log(parametros)
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.get('/api/usuarios', { params: parametros })
    window.console.log(dados)
    if (dados && dados && dados.status && dados.status !== 404) {
      await commit('SET_USUARIOS', dados.data)
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

export const exibirPosts = async ({ commit }, id) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.get('/api/posts/list/' + id)
    window.console.log(dados)
    if (dados && dados && dados.status && dados.status !== 404) {
      return dados.data && dados.data.rows && dados.data.rows.length ? dados.data.rows[0] : null
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
